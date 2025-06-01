{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {inherit system;};

    package = pkgs.buildNpmPackage {
      pname = "pleustradenn";
      version = "2.0.0";
      npmDepsHash = "sha256-qXEb92J1HLkPC6s7zwF+/Z/K1uUGNL8Bha08o8mVd+0=";
      src = ./.;

      PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
      PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
      PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
      PRISMA_HIDE_UPDATE_MESSAGE = "1";

      postBuild = ''
        export HOME=$TMPDIR
        npx prisma generate --no-hints
      '';

      installPhase = ''
        runHook preInstall
        mkdir -p $out/bin
        cp -r build prisma package.json node_modules $out/
        runHook postInstall
      '';
      NODE_ENV = "production";
    };

    startScript = pkgs.writeShellScriptBin "pleustradenn" ''
      export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
      export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
      export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
      export PRISMA_HIDE_UPDATE_MESSAGE=1

      if [ -f .env ]; then
        exec ${pkgs.nodejs}/bin/node --env-file=.env ${package}/build/index.js "$@"
      else
        echo "⚠️  .env not found, starting without it"
        exec ${pkgs.nodejs}/bin/node ${package}/build/index.js "$@"
      fi
    '';

    overlay = final: prev: {
      pleustradenn = package;
    };

    shell = pkgs.mkShell {
      buildInputs = with pkgs; [nodejs sqlite];
      shellHook = ''
        export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
        export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
        export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
        export PRISMA_HIDE_UPDATE_MESSAGE=1
      '';
    };

    service = {
      lib,
      config,
      pkgs,
      utils,
      ...
    }:
      with lib; let
        cfg = config.services.pleustradenn;
      in {
        options.services.pleustradenn = {
          enable = mkEnableOption "Pleustradenn web application";

          databaseUrl = mkOption {
            type = types.str;
            default = "file:/var/lib/pleustradenn/data.db";
            description = "Database connection string.";
          };

          allowRegistration = mkOption {
            type = types.bool;
            default = true;
            description = "Allow users to self-register.";
          };

          port = mkOption {
            type = types.port;
            default = 4173;
            description = "Port the server listens on.";
          };
        };

        config = mkIf cfg.enable {
          users.users.pleustradenn = {
            isSystemUser = true;
            group = "pleustradenn";
            home = "/var/lib/pleustradenn";
            createHome = true;
          };
          users.groups.pleustradenn = {};

          systemd.services.pleustradenn = {
            description = "Pleustradenn web application";
            after = ["network.target"];
            wantedBy = ["multi-user.target"];

            environment = {
              DATABASE_URL = cfg.databaseUrl;
              ALLOW_REGISTRATION = boolToString cfg.allowRegistration;
              PORT = toString cfg.port;
              PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
              PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
              PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
            };

            serviceConfig = {
              ExecStartPre = pkgs.writeShellScript "run-prisma-db-push" ''
                export DATABASE_URL="${cfg.databaseUrl}"
                export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
                export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
                export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
                export PRISMA_HIDE_UPDATE_MESSAGE=1

                ${package}/node_modules/.bin/prisma db push --accept-data-loss --schema ${package}/prisma/schema.prisma
              '';

              ExecStart = utils.escapeSystemdExecArgs [
                "${pkgs.nodejs}/bin/node"
                "${package}/build/index.js"
              ];
              WorkingDirectory = "/var/lib/pleustradenn";
              User = "pleustradenn";
              Group = "pleustradenn";
              StateDirectory = "pleustradenn";

              # These are the security settings for the service
              CapabilityBoundingSet = "";
              RestrictAddressFamilies = "AF_UNIX AF_INET AF_INET6";
              SystemCallFilter = "~@clock @cpu-emulation @keyring @module @obsolete @raw-io @reboot @swap @resources @privileged @mount @debug";
              NoNewPrivileges = "yes";
              ProtectClock = "yes";
              ProtectKernelLogs = "yes";
              ProtectControlGroups = "yes";
              ProtectKernelModules = "yes";
              SystemCallArchitectures = "native";
              RestrictNamespaces = "yes";
              RestrictSUIDSGID = "yes";
              ProtectHostname = "yes";
              ProtectKernelTunables = "yes";
              RestrictRealtime = "yes";
              ProtectProc = "invisible";
              PrivateUsers = "yes";
              LockPersonality = "yes";
              UMask = "0077";
              RemoveIPC = "yes";
              LimitCORE = "0";
              ProtectHome = "yes";
              PrivateTmp = "yes";
              ProtectSystem = "strict";
              ProcSubset = "pid";
              SocketBindAllow = ["tcp:${toString cfg.port}"];
              SocketBindDeny = "any";

              LimitNOFILE = 1024;
              LimitNPROC = 64;
              MemoryMax = "100M";
            };
          };
        };
      };

    app = {
      type = "app";
      program = "${startScript}/bin/pleustradenn";
    };
  in {
    packages.${system}.default = package;
    apps.${system}.default = app;
    devShells.${system}.default = shell;
    overlays.default = overlay;
    nixosModules.pleustradenn-service = service;
  };
}

{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {inherit system;};
    lib = pkgs.lib;

    prismaEnv = {
      PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
      PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
      PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
      PRISMA_HIDE_UPDATE_MESSAGE = "1";
    };

    exportPrismaEnv = lib.concatStringsSep "\n" (
      map (name: "export ${name}=\"${prismaEnv.${name}}\"")
      (builtins.attrNames prismaEnv)
    );

    package = pkgs.buildNpmPackage ({
        pname = "pleustradenn";
        version = "2.0.0";
        npmDepsHash = "sha256-qXEb92J1HLkPC6s7zwF+/Z/K1uUGNL8Bha08o8mVd+0=";
        src = ./.;
        NODE_ENV = "production";

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
      }
      // prismaEnv);

    startScript = pkgs.writeShellScriptBin "pleustradenn" ''
      ${exportPrismaEnv}

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
      shellHook = exportPrismaEnv;
    };

    service = {
      lib,
      config,
      pkgs,
      utils,
      ...
    }: let
      cfg = config.services.pleustradenn;
    in {
      options.services.pleustradenn = {
        enable = lib.mkEnableOption "Pleustradenn web application";

        databaseUrl = lib.mkOption {
          type = lib.types.str;
          default = "file:///var/lib/pleustradenn/prod.db";
          description = "Database connection string.";
        };

        allowRegistration = lib.mkOption {
          type = lib.types.bool;
          default = true;
          description = "Allow users to self-register.";
        };

        port = lib.mkOption {
          type = lib.types.port;
          default = 4173;
          description = "Port the server listens on.";
        };
      };

      config = lib.mkIf cfg.enable {
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

          environment =
            prismaEnv
            // {
              DATABASE_URL = cfg.databaseUrl;
              ALLOW_REGISTRATION = lib.boolToString cfg.allowRegistration;
              PORT = builtins.toString cfg.port;
            };

          serviceConfig = {
            ExecStartPre = pkgs.writeShellScript "run-prisma-migrate-deploy" ''
              export DATABASE_URL="${cfg.databaseUrl}"
              ${exportPrismaEnv}

              ${package}/node_modules/.bin/prisma migrate deploy --schema ${package}/prisma/schema.prisma
            '';

            ExecStart = utils.escapeSystemdExecArgs [
              "${pkgs.nodejs}/bin/node"
              "${package}/build/index.js"
            ];
            WorkingDirectory = "/var/lib/pleustradenn";
            User = "pleustradenn";
            Group = "pleustradenn";
            StateDirectory = "pleustradenn";

            # Security hardening
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
            SocketBindAllow = ["tcp:${builtins.toString cfg.port}"];
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

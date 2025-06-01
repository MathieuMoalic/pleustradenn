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
          enable = mkEnableOption "Pleustradenn community web application";

          databaseUrl = mkOption {
            type = types.str;
            default = "file:/var/lib/pleustradenn/data.db";
            description = "Database connection string.";
          };

          firstUserUsername = mkOption {
            type = types.str;
            default = "mat";
            description = "Initial admin username.";
          };

          firstUserPassword = mkOption {
            type = types.str;
            default = "matmat";
            description = "Initial admin password.";
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

          origin = mkOption {
            type = types.str;
            default = "http://localhost:4173";
            description = "CORS origin.";
          };

          openPort = mkOption {
            type = types.bool;
            default = true;
            description = "Open the port in the firewall.";
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
              FIRST_USER_USERNAME = cfg.firstUserUsername;
              FIRST_USER_PASSWORD = cfg.firstUserPassword;
              ALLOW_REGISTRATION = boolToString cfg.allowRegistration;
              PORT = toString cfg.port;
              ORIGIN = cfg.origin;
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
            };
          };

          networking.firewall.allowedTCPPorts = mkIf cfg.openPort [cfg.port];
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

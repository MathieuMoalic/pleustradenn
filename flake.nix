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

      nativeBuildInputs = [pkgs.prisma-engines pkgs.openssl];

      PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
      PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
      PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
      PRISMA_HIDE_UPDATE_MESSAGE = 1;

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
    };
    startScript = pkgs.writeShellScript "pleustradenn" ''
      exec ${pkgs.nodejs_24}/bin/node --env-file=.env ${package}/build/index.js "$@"
    '';

    pleustradennOverlay = final: prev: {
      pleustradenn = package;
    };
  in {
    packages.${system}.default = package;
    apps.${system}.default = {
      type = "app";
      program = "${startScript}";
    };

    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [nodejs_24 sqlite openssl prisma];
      PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
      PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
      PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
      PRISMA_HIDE_UPDATE_MESSAGE = 1;
    };

    overlays.default = pleustradennOverlay;

    nixosModules.default = {
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

          package = mkOption {
            type = types.package;
            default = pkgs.pleustradenn;
            description = "Package providing the Pleustradenn executable.";
          };

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
              LD_LIBRARY_PATH = lib.makeLibraryPath [pkgs.openssl];
            };

            serviceConfig = {
              ExecStart = utils.escapeSystemdExecArgs [
                "${pkgs.nodejs}/bin/node"
                "${cfg.package}/build/index.js"
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
  };
}

{
  description = "Pleustradenn Svelte/Prisma project";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = {
    self,
    nixpkgs,
  }: let
    systems = ["x86_64-linux" "aarch64-linux"];
    forAllSystems = f:
      builtins.listToAttrs (map (system: {
          name = system;
          value = f system;
        })
        systems);

    mkPleustradenn = {
      pkgs,
      version,
      npmDepsHash,
    }:
      pkgs.buildNpmPackage {
        pname = "pleustradenn";
        inherit version npmDepsHash;
        src = ./.;

        nativeBuildInputs = [pkgs.prisma-engines pkgs.openssl];

        PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
        PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
        PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
        PRISMA_INTROSPECTION_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/introspection-engine";
        PRISMA_FMT_BINARY = "${pkgs.prisma-engines}/bin/prisma-fmt";
        PRISMA_HIDE_UPDATE_MESSAGE = 1;

        installPhase = ''
          export HOME=$TMPDIR
          npx prisma generate --schema=./prisma/schema.prisma
          npm run build

          mkdir -p $out
          cp -r build $out/
          cp package.json $out/
          cp -r node_modules/@prisma $out/node_modules/
          cp -r prisma $out/
        '';
      };

    pleustradennService = {
      config,
      lib,
      pkgs,
      ...
    }: let
      cfg = config.services.pleustradenn;
      pleustradennPkg = self.packages.${pkgs.system}.default;
    in {
      options.services.pleustradenn = {
        enable = lib.mkEnableOption "Pleustradenn app";
        port = lib.mkOption {
          type = lib.types.port;
          default = 8083;
          description = "TCP port to listen on.";
        };
        host = lib.mkOption {
          type = lib.types.str;
          default = "0.0.0.0";
        };
        user = lib.mkOption {
          type = lib.types.str;
          default = "pleustradenn";
        };
        group = lib.mkOption {
          type = lib.types.str;
          default = "pleustradenn";
        };
      };

      config = lib.mkIf cfg.enable {
        systemd.services.pleustradenn = {
          description = "Pleustradenn static site";
          wantedBy = ["multi-user.target"];
          after = ["network.target"];
          serviceConfig = {
            Type = "simple";
            User = cfg.user;
            Group = cfg.group;
            ExecStart = "${pkgs.nodejs}/bin/node ${pleustradennPkg}/build/index.js";
            WorkingDirectory = "${pleustradennPkg}/build";
            Restart = "never";
            Environment = [
              "PRISMA_QUERY_ENGINE_LIBRARY=${pkgs.prisma-engines}/lib/libquery_engine.node"
              "PRISMA_QUERY_ENGINE_BINARY=${pkgs.prisma-engines}/bin/query-engine"
              "PRISMA_SCHEMA_ENGINE_BINARY=${pkgs.prisma-engines}/bin/schema-engine"
              "PRISMA_HIDE_UPDATE_MESSAGE=1"
              "NODE_ENV=production"
            ];
          };
        };

        users.users.${cfg.user} = {
          isSystemUser = true;
          group = cfg.group;
        };
        users.groups.${cfg.group} = {};
      };
    };
  in {
    packages = forAllSystems (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      default = mkPleustradenn {
        inherit pkgs;
        version = "2.0.0";
        npmDepsHash = "sha256-Y4CJ37BUolLNOI+y+48K4QX9cFc+1Eh8RiO78zBP/5M=";
      };
    });

    devShells = forAllSystems (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      default = pkgs.mkShell {
        buildInputs = with pkgs; [nodejs_24 sqlite openssl prisma];
        PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
        PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
        PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
        PRISMA_HIDE_UPDATE_MESSAGE = 1;
      };
    });

    nixosModules.pleustradenn-service = pleustradennService;
  };
}

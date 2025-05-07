{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};

        build = pkgs.buildNpmPackage {
          pname = "homepage";
          version = "2.0.0";
          src = ./.;
          npmDepsHash = "sha256-Y4CJ37BUolLNOI+y+48K4QX9cFc+1Eh8RiO78zBP/5M=";

          # make the engines available during the build
          nativeBuildInputs = [pkgs.prisma-engines pkgs.openssl];

          # export the paths so prisma & vite can see them
          PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
          PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
          PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
          PRISMA_INTROSPECTION_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/introspection-engine";
          PRISMA_FMT_BINARY = "${pkgs.prisma-engines}/bin/prisma-fmt";
          PRISMA_HIDE_UPDATE_MESSAGE = 1;

          installPhase = ''
            export HOME=$TMPDIR          # prisma writes into $HOME
            npx prisma generate --schema=./prisma/schema.prisma
            npm run build                # vite build now succeeds
            mkdir -p $out
            cp -r . $out
          '';
        };

        devEnv = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
            sqlite
            openssl
            prisma
          ];

          NODE_NO_WARNINGS = 1;
          PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
          PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
          PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
          PRISMA_HIDE_UPDATE_MESSAGE = 1;
        };
      in {
        devShell = devEnv;
        packages.default = build;
      }
    );
}

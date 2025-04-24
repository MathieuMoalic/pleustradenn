{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    fix-python.url = "github:GuillaumeDesforges/fix-python";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    fix-python,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
        devEnv = pkgs.mkShell {
          buildInputs = with pkgs; [
            fix-python.packages.${system}.default
            python312
            nodejs_23
            sqlite
            openssl # for prisma
          ];

          NODE_NO_WARNINGS = 1;
          PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
          PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
          PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
          PRISMA_HIDE_UPDATE_MESSAGE = 1;
          DATABASE_URL = "file:./db1.sqlite";

          shellHook = ''
            set -euo pipefail
            test -d .venv || (${pkgs.python3.interpreter} -m venv .venv && source .venv/bin/activate && pip install -e backend && fix-python --venv .venv && echo "use flake" > .envrc && direnv allow)
            source .venv/bin/activate
          '';
        };
      in {
        devShell = devEnv;
      }
    );
}

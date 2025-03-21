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
          ];

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

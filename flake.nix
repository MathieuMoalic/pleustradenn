{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {inherit system;};

    mkPleustradenn = pkgs.buildNpmPackage {
      pname = "pleustradenn";
      version = "2.0.0";
      npmDepsHash = "sha256-EAr2z/+Lkb15D5VQNkHFMsqdifY37fURFu+uU9qLe4w=";
      src = ./.;

      nativeBuildInputs = [pkgs.prisma-engines pkgs.openssl];

      PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
      PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
      PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
      PRISMA_HIDE_UPDATE_MESSAGE = 1;

      postBuild = ''
        export HOME=$TMPDIR
        npx prisma generate --schema=./prisma/schema.prisma
      '';

      installPhase = ''
        runHook preInstall
        mkdir -p $out/bin
        cp -r build prisma package.json node_modules $out/
        cat > $out/bin/pleustradenn <<EOF
        #!/usr/bin/env bash
        exec ${pkgs.nodejs}/bin/node --env-file=.env $out/build/index.js "\$@"
        EOF
        chmod +x $out/bin/pleustradenn
        runHook postInstall
      '';
    };
  in {
    packages.x86_64-linux.default = mkPleustradenn;

    devShells.x86_64-linux.default = pkgs.mkShell {
      buildInputs = with pkgs; [nodejs_24 sqlite openssl prisma];
      PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
      PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
      PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
      PRISMA_HIDE_UPDATE_MESSAGE = 1;
    };
  };
}

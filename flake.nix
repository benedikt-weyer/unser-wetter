{
  description = "Unser Wetter - React Native Expo Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            android_sdk.accept_license = true;
            allowUnfree = true;
          };
        };

        androidComposition = pkgs.androidenv.composeAndroidPackages {
          platformVersions = [ "34" "35" "36" ];
          buildToolsVersions = [ "34.0.0" "35.0.0" "36.0.0" ];
          includeEmulator = true;
          includeNDK = true;
          ndkVersions = [ "27.1.12297006" ];
          includeSources = false;
          includeSystemImages = true;
          systemImageTypes = [ "google_apis_playstore" ];
          abiVersions = [ "x86_64" "arm64-v8a" ];
          cmakeVersions = [ "3.22.1" ];
          includeExtras = [
            "extras;google;gcm"
          ];
        };

        androidSdk = androidComposition.androidsdk;
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            androidSdk
            jdk17
            watchman
          ];

          shellHook = ''
            export ANDROID_HOME="${androidSdk}/libexec/android-sdk"
            export ANDROID_SDK_ROOT="$ANDROID_HOME"
            export ANDROID_AVD_HOME="$HOME/.android/avd"
            export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$PATH"
            export JAVA_HOME="${pkgs.jdk17}"
            
            echo "Android development environment loaded!"
            echo "ANDROID_HOME: $ANDROID_HOME"
            echo "Node version: $(node --version)"
            echo "pnpm version: $(pnpm --version)"
            echo ""
            echo "Run 'pnpm android' to start the Expo development server with Android"
          '';
        };
      }
    );
}


#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="/mnt/c/Users/janan/OneDrive/Documents/Final-Year-Project"
TOOLS_DIR="$PROJECT_ROOT/.fabric-tools"

mkdir -p "$TOOLS_DIR/compose-install" "$TOOLS_DIR/jq-install"

cd "$TOOLS_DIR/compose-install"
rm -rf extracted *.deb
apt download docker-compose-v2
dpkg-deb -x docker-compose-v2_*.deb extracted
"$TOOLS_DIR/compose-install/extracted/usr/libexec/docker/cli-plugins/docker-compose" version

cd "$TOOLS_DIR/jq-install"
rm -rf extracted *.deb
apt download jq=1.7.1-3build1 libjq1=1.7.1-3build1 libonig5=6.9.9-1build1
for deb in ./*.deb; do
  dpkg-deb -x "$deb" extracted
done
LD_LIBRARY_PATH="$TOOLS_DIR/jq-install/extracted/usr/lib/x86_64-linux-gnu" \
  "$TOOLS_DIR/jq-install/extracted/usr/bin/jq" --version

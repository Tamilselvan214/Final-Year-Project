#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="/mnt/c/Users/janan/OneDrive/Documents/Final-Year-Project"
COMPOSE_WRAPPER_DIR="/tmp/fabric-bin"

mkdir -p "$COMPOSE_WRAPPER_DIR"

cat > "$COMPOSE_WRAPPER_DIR/docker-compose" <<'EOF'
#!/usr/bin/env sh
exec "/mnt/c/Users/janan/OneDrive/Documents/Final-Year-Project/.fabric-tools/compose-install/extracted/usr/libexec/docker/cli-plugins/docker-compose" "$@"
EOF

cat > "$COMPOSE_WRAPPER_DIR/jq" <<'EOF'
#!/usr/bin/env sh
export LD_LIBRARY_PATH="/mnt/c/Users/janan/OneDrive/Documents/Final-Year-Project/.fabric-tools/jq-install/extracted/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
exec "/mnt/c/Users/janan/OneDrive/Documents/Final-Year-Project/.fabric-tools/jq-install/extracted/usr/bin/jq" "$@"
EOF

chmod +x "$COMPOSE_WRAPPER_DIR/docker-compose" "$COMPOSE_WRAPPER_DIR/jq"
export PATH="$COMPOSE_WRAPPER_DIR:$PATH"

exec "$@"

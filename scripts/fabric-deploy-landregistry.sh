#!/usr/bin/env bash
set -euo pipefail

FABRIC_TEST_NETWORK="${FABRIC_TEST_NETWORK:-$HOME/fabric-samples/test-network}"
CHAINCODE_PATH="${CHAINCODE_PATH:-/mnt/c/Users/janan/OneDrive/Documents/Final-Year-Project/fabric-chaincode/land-registry-java}"
COMPOSE_WRAPPER_DIR="/tmp/fabric-bin"
LOCAL_DOCKER_COMPOSE="/mnt/c/Users/janan/OneDrive/Documents/Final-Year-Project/.fabric-tools/compose-install/extracted/usr/libexec/docker/cli-plugins/docker-compose"
LOCAL_JQ="/mnt/c/Users/janan/OneDrive/Documents/Final-Year-Project/.fabric-tools/jq-install/extracted/usr/bin/jq"
LOCAL_JQ_LIB="/mnt/c/Users/janan/OneDrive/Documents/Final-Year-Project/.fabric-tools/jq-install/extracted/usr/lib/x86_64-linux-gnu"

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
chmod +x "$COMPOSE_WRAPPER_DIR/docker-compose"
chmod +x "$COMPOSE_WRAPPER_DIR/jq"
export PATH="$COMPOSE_WRAPPER_DIR:$PATH"

if [ ! -d "$FABRIC_TEST_NETWORK" ]; then
  echo "Missing Fabric test network: $FABRIC_TEST_NETWORK" >&2
  exit 1
fi

if [ ! -x "$LOCAL_DOCKER_COMPOSE" ]; then
  echo "Missing Docker Compose executable: $LOCAL_DOCKER_COMPOSE" >&2
  exit 1
fi

if [ ! -x "$LOCAL_JQ" ] || [ ! -d "$LOCAL_JQ_LIB" ]; then
  echo "Missing local jq. Run scripts/setup-local-fabric-tools.sh from WSL first." >&2
  exit 1
fi

cd "$FABRIC_TEST_NETWORK"

./network.sh down
./network.sh up createChannel -ca
./network.sh deployCC \
  -ccn landregistry \
  -ccp "$CHAINCODE_PATH" \
  -ccl java \
  -ccv 1.0 \
  -ccs 1

#!/usr/bin/env bash
set -eo pipefail

TEST_NETWORK="${TEST_NETWORK:-$HOME/fabric-samples/test-network}"
CHANNEL_NAME="${CHANNEL_NAME:-mychannel}"
CHAINCODE_NAME="${CHAINCODE_NAME:-landregistry}"
LAND_ID="${1:-LAND$(date +%s)}"
OWNER_A="${2:-OWNER_A}"
OWNER_B="${3:-OWNER_B}"

cd "$TEST_NETWORK"
export PATH="$TEST_NETWORK/../bin:$PATH"
export FABRIC_CFG_PATH="$TEST_NETWORK/../config"
source scripts/envVar.sh

setGlobals 1

peer chaincode invoke \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls \
  --cafile "$ORDERER_CA" \
  -C "$CHANNEL_NAME" \
  -n "$CHAINCODE_NAME" \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles "$PEER0_ORG1_CA" \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles "$PEER0_ORG2_CA" \
  -c "{\"Args\":[\"createLandRecord\",\"$LAND_ID\",\"$OWNER_A\"]}"

sleep 5

echo "readLand after create:"
peer chaincode query \
  -C "$CHANNEL_NAME" \
  -n "$CHAINCODE_NAME" \
  -c "{\"Args\":[\"readLand\",\"$LAND_ID\"]}"

peer chaincode invoke \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls \
  --cafile "$ORDERER_CA" \
  -C "$CHANNEL_NAME" \
  -n "$CHAINCODE_NAME" \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles "$PEER0_ORG1_CA" \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles "$PEER0_ORG2_CA" \
  -c "{\"Args\":[\"transferLand\",\"$LAND_ID\",\"$OWNER_A\",\"$OWNER_B\"]}"

sleep 5

echo "readLand after transfer:"
peer chaincode query \
  -C "$CHANNEL_NAME" \
  -n "$CHAINCODE_NAME" \
  -c "{\"Args\":[\"readLand\",\"$LAND_ID\"]}"

echo "getLandHistory:"
peer chaincode query \
  -C "$CHANNEL_NAME" \
  -n "$CHAINCODE_NAME" \
  -c "{\"Args\":[\"getLandHistory\",\"$LAND_ID\"]}"

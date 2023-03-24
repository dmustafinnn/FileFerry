#!/bin/bash

DELAY=10

docker-compose --file docker-compose.yml down
docker-compose --file docker-compose.yml up -d

echo "****** Waiting for ${DELAY} seconds for containers to go up ******"
sleep $DELAY

# docker exec fileferry-primary /scripts/rs-init.sh
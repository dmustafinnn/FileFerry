#!/bin/bash

DELAY=30

mongosh <<EOF
var config = {
    "_id": "dbrs",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "fileferry-primary:27017",
            "priority": 2
        },
        {
            "_id": 2,
            "host": "fileferry-secondary-1:27017",
            "priority": 1
        },
        {
            "_id": 3,
            "host": "fileferry-secondary-2:27017",
            "priority": 1
        }
    ]
};
rs.initiate(config, { force: true });
EOF

echo "****** Waiting for ${DELAY} seconds for replicaset configuration to be applied ******"

sleep $DELAY

mongosh < /scripts/db-init.js
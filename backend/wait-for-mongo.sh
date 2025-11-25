#!/bin/sh

MONGO_HOST=${MONGOHOST:-mongo}
MONGO_PORT=${MONGOPORT:-27017}

echo "Waiting for MongoDB at $MONGO_HOST:$MONGO_PORT..."

until nc -z "$MONGO_HOST" "$MONGO_PORT"; do
  echo "MongoDB not available yet..."
  sleep 2
done

echo "MongoDB is up!"
exec "$@"

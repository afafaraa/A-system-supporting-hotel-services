MONGO_HOST=${MONGO_HOST:-mongo}
MONGO_PORT=${MONGO_PORT:-27017}
until nc -z "$MONGO_HOST" "$MONGO_PORT"; do
  sleep 2
done
exec "$@"

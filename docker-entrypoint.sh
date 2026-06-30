#!/bin/sh
set -e

STORAGE_ROOT="${POKEAPP_STORAGE:-}"

if [ -n "$STORAGE_ROOT" ] && [ -d "$STORAGE_ROOT" ]; then
    export STORAGE_PATH="$STORAGE_ROOT"
else
    export STORAGE_PATH="/app/public"
fi

node ensure-data.cjs

NEXT_PORT="${NEXT_PORT:-3000}"
NGINX_PORT="${PORT:-8080}"

mkdir -p /tmp/nginx /var/log/nginx
export NEXT_PORT NGINX_PORT STORAGE_PATH
envsubst '${NEXT_PORT} ${NGINX_PORT} ${STORAGE_PATH}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

su-exec nextjs env HOSTNAME=127.0.0.1 PORT="$NEXT_PORT" node server.js &

for _ in $(seq 1 90); do
    if wget -q -O /dev/null "http://127.0.0.1:${NEXT_PORT}/" 2>/dev/null; then
        break
    fi
    sleep 1
done

exec nginx -g 'daemon off;'

#!/bin/sh
set -e

# Ensure storage and cache directories exist with proper permissions
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache

# Use PORT from environment (Cloud Run sets this), default to 8080
export PORT=${PORT:-8080}

# Substitute PORT in nginx config template
envsubst '$PORT' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

# Start supervisord which manages nginx and php-fpm
exec supervisord -c /etc/supervisord.conf

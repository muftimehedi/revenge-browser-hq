#!/bin/sh
# Entrypoint for Cloud Run

# Ensure storage and cache directories exist with proper permissions
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache

# Start supervisord which manages nginx and php-fpm
exec supervisord -c /etc/supervisord.conf

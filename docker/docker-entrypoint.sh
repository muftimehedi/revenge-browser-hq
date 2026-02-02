#!/bin/sh
set -e

# Ensure storage directories are writable
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Clear any cached config that might have stale values
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Start supervisord
exec supervisord -c /etc/supervisord.conf

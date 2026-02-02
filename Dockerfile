# Multi-stage Dockerfile for Laravel on Cloud Run
# Stage 1: Dependencies
FROM composer:2.8 AS vendor

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-autoloader \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

# Stage 2: Frontend build
FROM node:22-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 3: Application
FROM php:8.4-fpm-alpine AS app

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    postgresql-client \
    curl \
    zip \
    unzip \
    git \
    postgresql-dev \
    libzip \
    libzip-dev \
    oniguruma-dev \
    icu-dev

# Install PHP extensions
RUN docker-php-ext-configure zip \
    && docker-php-ext-install pdo_pgsql zip mbstring opcache

# Install Redis extension (needs build deps)
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Install Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Create application directory
WORKDIR /var/www/html

# Copy vendor dependencies
COPY --from=vendor /app/vendor ./vendor

# Copy application files
COPY . .

# Copy built frontend assets
COPY --from=frontend /app/public/build ./public/build

# Set permissions
RUN mkdir -p /var/log/supervisor /var/run/supervisord \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && chmod -R 777 /var/www/html/storage/framework/cache

# Create minimal .env for bootstrap (APP_KEY comes from Cloud Run env vars)
RUN echo "APP_NAME=\"Revenge X HQ\"" > /var/www/html/.env \
    && echo "APP_ENV=production" >> /var/www/html/.env \
    && echo "APP_DEBUG=false" >> /var/www/html/.env \
    && echo "APP_KEY=base64:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789012345=" >> /var/www/html/.env \
    && echo "CACHE_DRIVER=array" >> /var/www/html/.env \
    && echo "SESSION_DRIVER=array" >> /var/www/html/.env \
    && echo "QUEUE_CONNECTION=sync" >> /var/www/html/.env \
    && echo "VIEW_COMPILED_PATH=/dev/null" >> /var/www/html/.env

# Install composer dependencies (no optimization - will happen at runtime)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-docker.conf

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisord.conf

# Copy PHP configuration
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Expose port
EXPOSE 8080

# Start supervisord (manages nginx + php-fpm)
CMD ["supervisord", "-c", "/etc/supervisord.conf"]

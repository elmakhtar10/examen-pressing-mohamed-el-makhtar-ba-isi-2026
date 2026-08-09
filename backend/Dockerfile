FROM php:8.3-fpm-alpine

# Installation des dépendances système et extensions PHP nécessaires (PostgreSQL, pdo_pgsql, etc.)
RUN apk add --no-linux-headers --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql zip

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Commande de démarrage
CMD composer install && php artisan serve --host=0.0.0.0 --port=8000

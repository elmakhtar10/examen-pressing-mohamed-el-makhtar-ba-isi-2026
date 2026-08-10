FROM php:8.4-fpm-alpine

# Installation des dépendances système et extensions PHP nécessaires
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    linux-headers \
    && docker-php-ext-install pdo pdo_pgsql zip

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Répertoire de travail
WORKDIR /var/www

# Copie du code source
COPY . .

# Permet d'exécuter Composer lors du build
RUN composer install --no-interaction --prefer-dist --optimize-autoloader || true

# Commande de démarrage (Install Composer si besoin + clé + démarrage serveur)
CMD sh -c "composer install --no-interaction && php artisan key:generate --no-interaction && php artisan serve --host=0.0.0.0 --port=8000"

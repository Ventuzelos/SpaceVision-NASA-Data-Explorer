FROM php:8.3-cli

RUN apt-get update && apt-get install -y git unzip libpq-dev libzip-dev && docker-php-ext-install pdo pdo_pgsql zip && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

ENV FRONTEND_URL=https://space-vision-nine.vercel.app
ENV CORS_ALLOWED_ORIGINS=https://space-vision-nine.vercel.app

COPY composer.json composer.lock ./

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

COPY . .

RUN composer dump-autoload --optimize && php artisan package:discover --ansi && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs && chmod -R 775 storage bootstrap/cache

EXPOSE 10000

CMD ["sh", "-c", "php artisan migrate --force && php artisan optimize && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]




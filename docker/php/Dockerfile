FROM php:8.3-fpm-alpine

# APK repository'leri güncelle (CDN sorunlarını çözer)
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories || \
    echo "http://dl-4.alpinelinux.org/alpine/v3.22/main" > /etc/apk/repositories && \
    echo "http://dl-4.alpinelinux.org/alpine/v3.22/community" >> /etc/apk/repositories

# APK cache'i güncelle
RUN apk update && apk upgrade

# Sistem bağımlılıklarını yükle
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    icu-dev \
    oniguruma-dev \
    linux-headers \
    autoconf \
    dpkg-dev dpkg \
    file \
    g++ \
    gcc \
    libc-dev \
    make \
    pkgconf \
    re2c

# PHP extensionlarını yükle
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    intl \
    zip \
    opcache

# Composer'ı yükle
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Çalışma dizini
WORKDIR /var/www/html

# PHP ayarları
RUN echo "memory_limit=256M" > /usr/local/etc/php/conf.d/memory-limit.ini && \
    echo "upload_max_filesize=20M" > /usr/local/etc/php/conf.d/upload-size.ini && \
    echo "post_max_size=20M" >> /usr/local/etc/php/conf.d/upload-size.ini

EXPOSE 9000

CMD ["php-fpm"]
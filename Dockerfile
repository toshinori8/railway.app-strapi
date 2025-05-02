FROM node:18-alpine

# Instalacja zależności systemowych (np. dla sharp)
RUN apk add --no-cache \
    build-base autoconf automake libtool \
    vips-dev git python3

WORKDIR /app

# Kopiowanie plików zależności i instalacja
COPY package.json yarn.lock ./
RUN yarn install

# Kopiowanie reszty plików projektu
COPY . .

# Tworzenie użytkownika nieroocowego
RUN addgroup -g 1001 -S strapi && adduser -S strapi -u 1001 -G strapi
USER strapi

EXPOSE 1337
CMD ["yarn", "develop"]

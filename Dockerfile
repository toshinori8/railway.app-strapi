# Faza build (kompilacja projektu Strapi)
FROM node:20-alpine AS build

# Potrzebne biblioteki dla zależności typu sharp
RUN apk update && apk add --no-cache \
    build-base autoconf automake libtool \
    vips-dev git python3

WORKDIR /app

# Kopiuj pliki pakietu i zainstaluj zależności
COPY package.json yarn.lock ./
RUN yarn install

# Skopiuj resztę aplikacji
COPY . .

# Buduj aplikację Strapi
RUN yarn build

# Faza produkcyjna (czysty obraz produkcyjny)
FROM node:20-alpine

RUN apk add --no-cache vips-dev

ENV NODE_ENV=production
WORKDIR /app

# Kopiuj zbudowaną aplikację z poprzedniego etapu
COPY --from=build /app ./

# 🔧 Ustawienia katalogów i uprawnień
RUN addgroup -g 1001 -S strapi && adduser -S strapi -u 1001 -G strapi \
    && mkdir -p /app/.tmp \
    && chown -R strapi:strapi /app

USER strapi

EXPOSE 1337
CMD ["yarn", "start"]

FROM node:18-alpine

# Dodatkowe zależności systemowe (np. do `sharp`)
RUN apk add --no-cache \
    build-base autoconf automake libtool \
    vips-dev git python3

WORKDIR /app

# Kopiuj zależności i instaluj
COPY package.json yarn.lock ./
RUN yarn install

# Kopiuj cały projekt
COPY . .

# Użytkownik nieroocowy
RUN addgroup -g 1001 -S strapi && adduser -S strapi -u 1001 -G strapi
USER strapi

EXPOSE 1337
CMD ["yarn", "develop"]
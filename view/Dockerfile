FROM node:20-alpine AS dev

WORKDIR /app

RUN npm install -g npm@11.2.0

RUN npm install -g pnpm

RUN pnpm config set global-bin-dir /usr/local/bin

RUN pnpm add openapi-zod-client -g

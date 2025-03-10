# Use the official Node.js image as the base image
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# pnpmをインストール
RUN npm install -g pnpm

# pnpm のグローバルバイナリディレクトリを設定
RUN pnpm config set global-bin-dir /usr/local/bin

RUN pnpm add openapi-zod-client -g

FROM base AS dev

# Expose the port the app runs on
EXPOSE 3000

# パッケージファイルをコピーして依存関係をインストール
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

CMD ["pnpm","dev"]

FROM base AS prod

# パッケージファイルをコピーして依存関係をインストール
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

EXPOSE 3000

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the app
RUN pnpm build

# Run the web service on container startup.
CMD ["pnpm", "run", "start"]



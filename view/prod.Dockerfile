# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# pnpmをインストール
RUN npm install -g pnpm

# pnpm のグローバルバイナリディレクトリを設定
RUN pnpm config set global-bin-dir /usr/local/bin

# Expose the port the app runs on
EXPOSE 3000

# パッケージファイルをコピーして依存関係をインストール
COPY package.json pnpm-lock.yaml ./

CMD ["pnpm","run","start"]

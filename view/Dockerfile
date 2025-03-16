FROM node:22-alpine AS dev

ENV NODE_ENV=development

WORKDIR /app

RUN npm install -g npm@11.2.0

# Enable pnpm
ENV YARN_HOME="/yarn"
ENV PATH="$YARN_HOME:$PATH"
RUN corepack enable

CMD ["yarn", "dev"]

FROM node:22-alpine AS prod

ENV NODE_ENV=production

WORKDIR /app

# Enable pnpm
ENV YARN_HOME="/yarn"
ENV PATH="$YARN_HOME:$PATH"
RUN corepack enable

COPY . .

RUN yarn install

EXPOSE 3000

# Copy the rest of your app's source code from your host to your image filesystem.

# Build the app

# RUN yarn build

CMD ["yarn", "start"]

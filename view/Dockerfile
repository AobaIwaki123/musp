FROM node:22-alpine AS dev

WORKDIR /app

# Enable pnpm
ENV YARN_HOME="/yarn"
ENV PATH="$YARN_HOME:$PATH"
RUN corepack enable

RUN yarn install

RUN npm add -g openapi-zod-client

CMD ["yarn", "dev"]

FROM node:22-alpine AS prod

WORKDIR /app

# Enable pnpm
ENV YARN_HOME="/yarn"
ENV PATH="$YARN_HOME:$PATH"
RUN corepack enable

RUN yarn install

EXPOSE 3000

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the app
RUN yarn build

CMD ["yarn", "start"]

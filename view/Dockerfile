FROM node:22-alpine AS dev

WORKDIR /app

# Enable pnpm
ENV YARN_HOME="/yarn"
ENV PATH="$YARN_HOME:$PATH"
RUN corepack enable

CMD ["yarn", "dev"]

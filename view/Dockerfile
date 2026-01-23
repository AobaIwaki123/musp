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

COPY --from=dev /app/public ./public
COPY --from=dev /app/.next/standalone ./
COPY --from=dev /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]

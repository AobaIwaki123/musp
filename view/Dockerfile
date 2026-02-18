FROM node:22-alpine AS dev

ENV NODE_ENV=development

WORKDIR /app

RUN npm install -g npm@11.2.0

# Enable pnpm
ENV YARN_HOME="/yarn"
ENV PATH="$YARN_HOME:$PATH"
RUN corepack enable

CMD ["yarn", "dev"]

FROM node:22-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare yarn@4.7.0 --activate
RUN \
  if [ -f yarn.lock ]; then yarn config set nodeLinker node-modules && yarn install; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Next.js の NEXT_PUBLIC_* 変数はビルド時に埋め込まれるため、ARG で受け取る
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MUSP_API_KEY
ARG NEXT_PUBLIC_FIREBASE_APIKEY
ARG NEXT_PUBLIC_AUTHDOMAIN
ARG NEXT_PUBLIC_PROJECTID
ARG NEXT_PUBLIC_STORAGEBUCKET
ARG NEXT_PUBLIC_MESSAGINGSENDERID
ARG NEXT_PUBLIC_APPID
ARG NEXT_PUBLIC_MEASUREMENTID

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_MUSP_API_KEY=${NEXT_PUBLIC_MUSP_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_APIKEY=${NEXT_PUBLIC_FIREBASE_APIKEY}
ENV NEXT_PUBLIC_AUTHDOMAIN=${NEXT_PUBLIC_AUTHDOMAIN}
ENV NEXT_PUBLIC_PROJECTID=${NEXT_PUBLIC_PROJECTID}
ENV NEXT_PUBLIC_STORAGEBUCKET=${NEXT_PUBLIC_STORAGEBUCKET}
ENV NEXT_PUBLIC_MESSAGINGSENDERID=${NEXT_PUBLIC_MESSAGINGSENDERID}
ENV NEXT_PUBLIC_APPID=${NEXT_PUBLIC_APPID}
ENV NEXT_PUBLIC_MEASUREMENTID=${NEXT_PUBLIC_MEASUREMENTID}

RUN corepack enable && corepack prepare yarn@4.7.0 --activate
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]

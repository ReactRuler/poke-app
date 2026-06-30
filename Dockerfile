FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm && pnpm build
RUN pnpm exec esbuild scripts/ensure-data.ts --bundle --platform=node --format=cjs --outfile=dist/ensure-data.cjs --alias:@=./src

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PORT=3000
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

RUN apk add --no-cache nginx su-exec gettext wget \
    && mkdir -p /var/log/nginx /tmp/nginx /etc/nginx/conf.d /etc/nginx/templates \
    && chown -R nextjs:nodejs /var/log/nginx /tmp/nginx

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/dist/ensure-data.cjs ./ensure-data.cjs
COPY docker-entrypoint.sh ./
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

RUN chmod +x docker-entrypoint.sh \
    && mkdir -p public/data public/pokemon \
    && chown -R nextjs:nodejs public

EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.sh"]

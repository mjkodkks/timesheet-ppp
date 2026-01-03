FROM oven/bun:1.3.5-slim AS base
WORKDIR /app

FROM base AS builder
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
COPY . .

EXPOSE 4343
CMD ["bun", "run", "src/index.ts"]

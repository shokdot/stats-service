FROM node:20 AS builder

WORKDIR /apps

COPY core/package*.json core/
COPY core/tsconfig.json core/
COPY core/src core/src

WORKDIR /apps/core
RUN npm install && npm run build

WORKDIR /apps

COPY stats-service/package*.json stats-service/
COPY stats-service/tsconfig.json stats-service/
COPY stats-service/tsup.config.ts stats-service/
COPY stats-service/src stats-service/src
COPY stats-service/prisma stats-service/prisma
COPY stats-service/prisma.config.ts stats-service/

WORKDIR /apps/stats-service

RUN npm install
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /apps

COPY --from=builder /apps/core/dist core/dist
COPY --from=builder /apps/stats-service/dist stats-service/dist
COPY --from=builder /apps/stats-service/package*.json stats-service/
COPY --from=builder /apps/stats-service/prisma stats-service/prisma
COPY --from=builder /apps/stats-service/prisma.config.ts stats-service/

WORKDIR /apps/stats-service

RUN npm install --omit=dev

EXPOSE 3005

CMD ["npm", "run", "start"]

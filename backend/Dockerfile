FROM node:20-alpine AS builder
WORKDIR /app

COPY shared/package.json shared/
COPY package.json package-lock.json* ./

RUN npm install --prefix shared && npm run build --prefix shared
RUN npm install

COPY shared shared
COPY tsconfig.json tsconfig.base.json ./
COPY src src

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY shared/package.json shared/
COPY --from=builder /app/shared/dist shared/dist
COPY --from=builder /app/dist dist
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/shared/node_modules shared/node_modules

EXPOSE 4000
CMD ["node", "dist/index.js"]

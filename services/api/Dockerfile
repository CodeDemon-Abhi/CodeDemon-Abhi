FROM node:18-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=deps /usr/src/app/package*.json ./
RUN npm ci --omit=dev
COPY --from=deps /usr/src/app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]


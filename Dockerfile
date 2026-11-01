# Full-Stack ApexLMS Container (Vite Frontend & Express API)
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 80
ENV PORT=80
ENV NODE_ENV=production

CMD ["npx", "tsx", "server.ts"]

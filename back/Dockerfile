FROM node:26.12.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY back ./back

EXPOSE 3000

CMD ["node", "back/server.js"]

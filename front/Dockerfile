FROM node:22-alpine

WORKDIR /app

COPY front/package*.json ./
RUN npm ci

COPY front ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

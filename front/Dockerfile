FROM node:26.12.1-alpine

WORKDIR /app

COPY front/package*.json ./
RUN npm ci

COPY front ./

EXPOSE 5173

RUN npm run build

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]

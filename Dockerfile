FROM node:latest AS builder
WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 4200
CMD ["npm", "start"]
FROM node:19.5.0-alpine AS builder
WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:1.17.1-alpine
RUN rm -rf /usr/share/nginx/html/* 
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/pri /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

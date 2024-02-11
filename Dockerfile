FROM node:latest AS builder
WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:1.18.0-alpine-perl
ARG NGINX_CONF
RUN apk add --no-cache nginx-mod-http-perl
RUN rm -rf /usr/share/nginx/html/*
COPY $NGINX_CONF /etc/nginx/nginx.conf
COPY --from=builder /app/dist/pri /usr/share/nginx/html

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

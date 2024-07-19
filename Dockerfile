### build stage ###
FROM node:20.10.0-alpine AS builder
WORKDIR /build
#ARG CI_ENVIRONMENT_NAME
COPY . .
RUN yarn install && yarn build

### release stage ###
FROM nginx:1.27.0-alpine3.19
WORKDIR /usr/share/nginx/html
COPY config/nginx/conf.d/ /etc/nginx/conf.d/
COPY --from=builder /build/dist /usr/share/nginx/html
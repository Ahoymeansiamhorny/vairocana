FROM nginx:stable-alpine as production-stage

COPY ./config/nginx/conf.d/ /etc/nginx/conf.d/

COPY ./config/nginx/nginx.conf /etc/nginx/nginx.conf

COPY dist/ /usr/share/nginx/html

EXPOSE 80
# 設定容器啟動時的指令
CMD ["nginx", "-g", "daemon off;"]


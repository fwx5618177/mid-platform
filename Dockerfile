FROM nginx:alpine

COPY dist/ /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

RUN sed -i '/worker_processes/c\worker_processes 4;' /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Stage 1 - Install node dependencies and build with webpack
FROM node:latest as builder
ARG SRC_PATH=/usr/src/app
WORKDIR ${SRC_PATH}
COPY . .
RUN npm install --silent
RUN npm run build

# Stage 2 - Production environment
FROM nginx:alpine
ARG SRC_PATH=/usr/src/app
COPY --from=builder ${SRC_PATH}/dist /usr/share/nginx/html
COPY --from=builder ${SRC_PATH}/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
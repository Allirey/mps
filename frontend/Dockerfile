FROM node:alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine as production-stage

COPY --from=build-stage /app/build /app

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

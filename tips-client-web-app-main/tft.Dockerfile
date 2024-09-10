FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN yarn install

ARG API_GATEWAY_IP
ARG API_GATEWAY_PORT
ARG API_GATEWAY_PATH
ARG AI_STREAM_SERVICE_PORT
ARG GCS_PORT
ARG GAION_IP

RUN rm -f .env.local
RUN rm -f .env
COPY .env.docker .env.production.local
RUN echo REACT_APP_API_GATEWAY=${API_GATEWAY_IP} >> .env.production.local
RUN echo REACT_APP_API_GATEWAY_PORT=${API_GATEWAY_PORT} >> .env.production.local
RUN echo REACT_APP_API_GATEWAY_PATH=${API_GATEWAY_PATH} >> .env.production.local

RUN echo REACT_APP_GCS_SERVER_URL=http://${GAION_IP} >> .env.production.local
RUN echo REACT_APP_GCS_SERVER_PORT=${GCS_PORT} >> .env.production.local

RUN echo REACT_APP_AI_STREAM_SERVICE_URL=http://${GAION_IP} >> .env.production.local
RUN echo REACT_APP_AI_STREAM_SERVICE_PORT=${AI_STREAM_SERVICE_PORT} >> .env.production.local

FROM builder as tft-builder
RUN echo PUBLIC_URL=/control >> .env.production.local
RUN echo REACT_APP_THEME_NAME=tft >> .env.production.local

RUN yarn build


FROM nginx:latest
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=tft-builder /app/build ./control

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
EXPOSE 8689
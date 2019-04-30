FROM node:11-alpine
RUN apk update && apk add python make build-base gcc wget git graphicsmagick
COPY . .
RUN npm i
EXPOSE 3000

# syntax=docker/dockerfile:1
FROM node:18-slim
LABEL maintainer="SkyCrypt"

RUN mkdir -p /bunibot
WORKDIR '/bunibot'
COPY . /bunibot

RUN npm install

CMD [ "node", "buni.js" ]

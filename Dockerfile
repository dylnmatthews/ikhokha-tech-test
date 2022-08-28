FROM node:18.8.0

WORKDIR /techtest

ADD . /techtest

RUN npm i
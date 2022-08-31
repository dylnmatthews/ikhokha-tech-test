FROM node:18.8.0
#uses official node docker image wil node 18.8.0

WORKDIR /techtest

ADD . /techtest

RUN npm i
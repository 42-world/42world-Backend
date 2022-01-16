FROM node:16-alpine3.14
RUN apk add --no-cache 

COPY ./config ./config
COPY ./dist ./dist
COPY package.json .
COPY yarn.lock .

RUN yarn install

ENTRYPOINT ["node", "dist/main.js"]
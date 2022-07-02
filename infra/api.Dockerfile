FROM node:16-alpine3.14
RUN apk add --no-cache 

RUN mkdir /home/ft-world

WORKDIR /home/ft-world

COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY libs libs
COPY apps apps

RUN yarn build api

ENTRYPOINT ["node", "dist/apps/api/src/main.js"]
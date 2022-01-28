FROM node:16-alpine3.14
RUN apk add --no-cache 

COPY ./config ./config
COPY ./src ./src
COPY ./test ./test

COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .

RUN yarn install
RUN yarn build

ENTRYPOINT ["node", "dist/main.js"]
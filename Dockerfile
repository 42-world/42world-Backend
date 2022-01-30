FROM node:16-alpine3.14
RUN apk add --no-cache 

RUN mkdir ft-world

WORKDIR ft-world

COPY ./config ./config
COPY ./src ./src
COPY ./test ./test
COPY ./views ./views

COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .

RUN yarn install
RUN yarn build

COPY ./views ./dist/views

ENTRYPOINT ["node", "dist/main.js"]
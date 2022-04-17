FROM node:16-alpine3.14
RUN apk add --no-cache 

RUN mkdir ft-world

WORKDIR ft-world

COPY apps apps
COPY libs libs

COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .

RUN yarn install
RUN yarn build

ENTRYPOINT ["node", "dist/apps/api/src/main.js"]
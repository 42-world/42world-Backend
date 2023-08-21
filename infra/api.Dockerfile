FROM node:18-alpine3.14

WORKDIR /app

COPY . .

RUN yarn install --forzon-lockfile
RUN yarn build api
RUN yarn install --production --forzon-lockfile

ENTRYPOINT ["node", "dist/apps/api/src/main.js"]

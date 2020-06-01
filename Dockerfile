FROM node

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./lerna.json .
COPY ./packages/api/package.json ./packages/api/
COPY ./packages/config/package.json ./packages/config/
COPY ./packages/utils/package.json ./packages/utils/
COPY ./packages/validation/package.json ./packages/validation/

RUN yarn
RUN yarn lerna:bootstrap

COPY . .
RUN yarn build:utils

CMD ["yarn", "dev"]

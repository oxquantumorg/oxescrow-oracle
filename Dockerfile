FROM node:16.20.1 AS BUILD_IMAGE

WORKDIR ./

COPY package.json yarn.lock ./
COPY . .

ENV PATH ./node_modules/.bin:$PATH

RUN yarn install
RUN yarn build

EXPOSE 4001

CMD ["yarn", "start"]

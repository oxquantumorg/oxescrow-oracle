FROM node:16.15.0-alpine AS BUILD_IMAGE

WORKDIR ./

COPY package.json yarn.lock ./
COPY . .
RUN rm ./.env.development

ENV PATH ./node_modules/.bin:$PATH

RUN yarn install
RUN yarn build

EXPOSE 4001

CMD ["yarn", "start"]

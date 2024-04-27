FROM node:alpine
WORKDIR /rode-be-api
COPY . .
RUN yarn install -f
RUN yarn build
CMD ["yarn", "start:prod"]

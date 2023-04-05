FROM node:18-alpine
RUN apk add openjdk8 build-base chromium tzdata
ENV TZ Asia/Ho_Chi_Minh
WORKDIR /app
COPY . .
COPY .env.deploy .env
RUN npm install -f
RUN npm run build
CMD ["npm", "run", "start:prod"]
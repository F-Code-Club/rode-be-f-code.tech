FROM ubuntu:22.04
RUN apt-get update
RUN apt-get install openjdk-8-jdk gcc chromium tzdata
ENV TZ Asia/Ho_Chi_Minh
WORKDIR /app
COPY . .
COPY .env.deploy .env
RUN npm install -f
RUN npm run build
CMD ["npm", "run", "start:prod"]

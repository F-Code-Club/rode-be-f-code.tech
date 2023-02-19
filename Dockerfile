FROM ubuntu:22.04
RUN apt-get update
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - &&\ apt-get install -y nodejs
RUN apt-get install -y build-essential
RUN apt-get install -y openjdk-8-jdk
WORKDIR /app
COPY . .
COPY .env.deploy .env
RUN npm install -f
RUN npm run build

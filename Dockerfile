FROM node:16-alpine
RUN apk add openjdk8 gcc
WORKDIR /app
COPY . .
COPY .env.deploy .env
RUN npm install -f
RUN npm run build
CMD ["npm", "run", "start:prod"]
FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install
COPY dist .
CMD ["npm", "run", "start:prod"]
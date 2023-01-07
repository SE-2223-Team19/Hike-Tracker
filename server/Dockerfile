FROM node:16.19.0-slim

WORKDIR /api

COPY package.json .
COPY package-lock.json .
RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
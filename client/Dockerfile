FROM node

WORKDIR /client

COPY package.json .
COPY package-lock.json .

RUN npm install

# For Linux (???)
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
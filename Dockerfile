FROM node:19.0.1

RUN apt-get update && apt-get install -y redis-server

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

RUN npm install -g nodemon

COPY . /usr/src/app

EXPOSE 5000

CMD ["sh", "-c", "redis-server & nodemon server.js"]
FROM node:16.18-alpine

EXPOSE 8080

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production-only

COPY . .

CMD [ "npm", "run", "start" ]

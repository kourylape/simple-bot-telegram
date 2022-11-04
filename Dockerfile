FROM 16.18-alpine

EXPOSE 8080

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "npm", "run", "start" ]

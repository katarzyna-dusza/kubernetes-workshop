FROM node:14

COPY . .
RUN npm install

EXPOSE 3000

CMD USER_NAME=$USER node server.js

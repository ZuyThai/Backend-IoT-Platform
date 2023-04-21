#build app
FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app
ENV NODE_ENV=development
COPY . .
RUN npm install
EXPOSE 5000
CMD [ "npm", "start" ]
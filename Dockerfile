FROM node:19.2-slim
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN pwd
COPY package.json .
USER node

RUN npm install
COPY --chown=node:node . .
EXPOSE 8081
WORKDIR /home/node/app/TRIUMF-backend

CMD [ "node", "app.js" ]
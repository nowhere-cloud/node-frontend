FROM node:alpine

WORKDIR /srv

COPY . /srv

RUN npm install --production

EXPOSE 80

ENTRYPOINT ["npm", "start", "--production"]

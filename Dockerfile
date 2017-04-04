FROM node:alpine

WORKDIR /srv

COPY . /srv

RUN npm install --production

EXPOSE 3000

ENTRYPOINT ["npm", "start", "--production"]

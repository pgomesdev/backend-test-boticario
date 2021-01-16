FROM node:14.15.4-alpine

WORKDIR /home/app

COPY . ./

RUN yarn && yarn cache clean

EXPOSE 3000
EXPOSE 9229

CMD ["node", "dist/main.js"]

FROM node

WORKDIR /NSP

COPY . .

RUN npm install

EXPOSE 5173

CMD [ "npm","run","dev" ]
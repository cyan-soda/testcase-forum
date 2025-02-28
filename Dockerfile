FROM node:18

WORKDIR /usr/src/frontend

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3001

CMD ["yarn", "dev", "--port", "3001"]

FROM --platform=linux/amd64 node:20.10.0
WORKDIR /src
COPY package*.json .
RUN yarn install --frozen-lockfile 
COPY . .
CMD ["npm", "start"]
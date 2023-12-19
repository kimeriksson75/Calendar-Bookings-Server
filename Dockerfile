FROM --platform=linux/amd64 node:20
WORKDIR /src
COPY package*.json .
RUN yarn ci 
COPY . .
CMD ["yarn", "start"]
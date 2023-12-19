FROM --platform=linux/amd64 node:20
WORKDIR /src
COPY package*.json .
RUN npm ci 
COPY . .
CMD ["npm", "start"]
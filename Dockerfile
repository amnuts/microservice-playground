FROM node:8-alpine

WORKDIR /usr/app
COPY package*.json ./
RUN yarn

# for production:
# RUN npm install --only=production

COPY . .

FROM node:8-alpine

WORKDIR /usr/app
COPY package*.json ./
RUN npm install --quiet

# for production:
# RUN npm install --only=production

COPY . .

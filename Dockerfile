
# Fetching the latest node image on alpine linux
FROM node:alpine as build

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copying all the files in our project
COPY . ./

RUN npm run build
RUN npm start

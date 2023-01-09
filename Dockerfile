
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

# production stage
FROM nginx:1.21.5-alpine as production-stage
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

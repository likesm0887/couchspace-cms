
# Fetching the latest node image on alpine linux
FROM node:alpine as build-stage

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY package.json ./
COPY .env   ./
COPY nginx.conf ./
RUN npm install --legacy-peer-deps

# Copying all the files in our project
COPY . .

RUN npm run build

FROM nginx:1.21.5-alpine as production-stage
RUN rm -rf ./*
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/build .
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


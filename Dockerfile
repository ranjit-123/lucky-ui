# we are extending everything from tomcat:8.0 image ...
FROM node:16.13.1 as node
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run build

# COPY path-to-your-application-war path-to-webapps-in-docker-tomcat
FROM nginx:alpine
COPY --from=node /app/dist/luckyui /usr/share/nginx/html
# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install && npm audit fix
COPY . .
RUN npm run build

# production stage
FROM nginx:1.20-alpine as production-stage2
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# docker build -t vue-prod -f Dockerfile
# docker run -itd -p 8080:80 vue-prod
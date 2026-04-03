# Stage 1: Build the React application using Node.js
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the static files
COPY . .
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:alpine

# Copy built files from the build stage to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
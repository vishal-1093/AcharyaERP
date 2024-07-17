# Use an official ARM-based Node.js runtime as a parent image
FROM node:16-alpine as build

# Set environment variable for Node.js memory allocation (adjust as needed)
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm cache clean --force
# Install dependencies
RUN npm install --force

# Copy the entire project to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Use NGINX to serve the React app in production
FROM nginx:alpine

# Copy the build files from the previous stage to NGINX directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the ngnix.conf to the container
COPY nginx.conf /etc/nginx/nginx.conf
 
# Expose port 3000 
EXPOSE 3000

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]

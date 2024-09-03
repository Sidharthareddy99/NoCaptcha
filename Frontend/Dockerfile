# Use the official Node.js image as a base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm i vite

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Expose port 5173
EXPOSE 5173

# Start the application on port 5173
CMD ["serve", "-s", "build", "-l", "5173"]

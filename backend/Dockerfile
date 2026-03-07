# Use Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the backend port
EXPOSE 5000

# Set environment variables (defaults, can be overridden by docker-compose)
ENV PORT=5000
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]

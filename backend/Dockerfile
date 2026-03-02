# Use a lightweight Node.js environment
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose port 5000 so the frontend can reach it
EXPOSE 5000

# Start the Node server
CMD ["node", "server.js"]
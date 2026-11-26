
# Use Node.js 22 Alpine as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy backend source code
COPY . .

# Set production environment
ENV NODE_ENV=production

# Document the default backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]

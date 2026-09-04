# 1. Base Image: Lightweight Node.js 18 on Linux Alpine
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package dependency files first (for caching layers)
COPY package*.json ./

# 4. Install production dependencies
RUN npm install --only=production

# 5. Copy the rest of the backend source code
COPY . .

# 6. Expose the port your Express server listens on (e.g. 5000)
EXPOSE 5000

# 7. Command to run the application when container starts
CMD ["node", "server.js"]

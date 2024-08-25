# Use Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

COPY .env .env.development ./

# Install Node.js dependencies
RUN npm install --production

# RUN npm install -g @nestjs/cli
# Copy the application code
COPY . .

# Expose the port that the app listens on
EXPOSE 3000

# Command to start the Node.js application
# CMD ["npm", "start"]
CMD ["node","dist/main.js"]

# Use official Node.js 20 image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if present)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the remaining application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the application in development mode
CMD ["npm", "run", "dev"]

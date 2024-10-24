# Step 1: Use Node.js 20 for the build stage
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js app for production
RUN npm run build

# Step 2: Use Node.js 20 for the production stage
FROM node:20-alpine AS production

# Set the working directory inside the container
WORKDIR /app

# Copy the built Next.js app from the build stage to the production stage
COPY --from=build /app ./

# Expose the port on which the Next.js app will run
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "run", "start"]

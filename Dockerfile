# syntax=docker/dockerfile:1

################################################################################
# Use node image for base image for all stages.
FROM node:18-alpine

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Copy the source files into the image.
COPY . .

RUN npm install

# Run the application.
CMD ["npm", "start"]

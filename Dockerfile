# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installation
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-venv python3-pip

# Copy requirements.txt and install Python dependencies
COPY ./scripts/requirements.txt /scripts/requirements.txt

# Create and activate the Python virtual environment, then install dependencies
RUN python3 -m venv /scripts/venv && /scripts/venv/bin/pip install --no-cache-dir -r /scripts/requirements.txt

# Expose the port that your app will run on
EXPOSE 3000

# Command to start the development server
CMD ["npm", "run", "dev"]
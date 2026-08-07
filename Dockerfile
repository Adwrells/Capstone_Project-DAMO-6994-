# Use an official Node runtime as a parent image (slim variant for smaller size)
FROM node:20-slim

# Install Python and necessary build tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy Node.js package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy Python requirements and set up virtual environment
COPY requirements.txt ./
RUN python3 -m venv /opt/venv
# Enable venv by modifying the PATH
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Build the application (Vite frontend + esbuild backend)
RUN npm run build

# Ensure the uploads directory exists (since it's in .gitignore)
RUN mkdir -p uploads

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app using the production start script
CMD ["npm", "start"]

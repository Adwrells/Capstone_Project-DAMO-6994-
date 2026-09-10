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

# Run as an unprivileged user rather than root — neither service needs root, and the base
# image already ships a "node" user/group for exactly this. Ownership must be set before
# switching, since everything above (including npm install/build) ran as root.
RUN chown -R node:node /app
USER node

# This single image serves both the Node server and the FastAPI backend — docker-compose.yml
# builds it twice, once per service, overriding CMD below with `command:` so each container
# runs one process. `docker run` directly (no compose) gets this default, Node-only behavior;
# see docker-compose.yml's `python` service for the `uvicorn backend.main:app` equivalent.
EXPOSE 3000 8000

# Lets `docker ps`/`docker compose ps` and any restart policy see a hung server as unhealthy
# instead of "running" forever. Checks whichever port this container's CMD actually serves.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || process.env.API_PORT || 3000) + '/', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["npm", "start"]

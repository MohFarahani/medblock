# Build stage
FROM --platform=$BUILDPLATFORM node:20-slim AS builder

# Install Python and required system dependencies
RUN apt-get update && apt-get install -y \
    python3-full \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create and activate Python virtual environment
ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Install Python dependencies in the virtual environment
RUN pip3 install --no-cache-dir -r requirements.txt

# Build the application
RUN yarn build

# Production stage
FROM --platform=$TARGETPLATFORM node:20-slim

# Install Python and required system dependencies
RUN apt-get update && apt-get install -y \
    python3-full \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create and activate Python virtual environment
ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy package files
COPY package*.json yarn.lock ./

# Install production dependencies
RUN yarn install --production --frozen-lockfile

# Copy built application and virtual environment from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/python_env ./python_env
COPY --from=builder /app/venv ./venv

# Copy Python requirements (for reference)
COPY python_env/requirements.txt ./

# Make start script executable
RUN chmod +x ./scripts/start-db.sh

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"] 
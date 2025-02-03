# Build stage
FROM --platform=$BUILDPLATFORM node:20-slim AS builder

# Install required system packages including python3-venv and build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy application code
COPY . .
RUN ls -la
RUN ls -la src/components/
RUN ls -la src/components/DicomTable/
RUN ls -la src/components/Table/
# Create necessary directories with proper permissions
RUN mkdir -p /app/python_env && \
    mkdir -p /app/dicom_files && \
    chmod 777 /app/dicom_files && \
    chmod -R 755 /app/python_env

# Set up Python environment with venv subdirectory
ENV VIRTUAL_ENV=/app/python_env/venv
ENV PYTHON_PATH=$VIRTUAL_ENV/bin/python3
ENV PIP_PATH=$VIRTUAL_ENV/bin/pip3
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Verify Python installation before venv creation
RUN python3 --version && \
    which python3 && \
    python3 -c "import venv; print('venv module available')" && \
    python3 -c "import venv; print(venv.__file__)"

# Create virtual environment in the venv subdirectory with verification
RUN mkdir -p $VIRTUAL_ENV && \
    python3 -m venv --clear --copies $VIRTUAL_ENV && \
    ls -la $VIRTUAL_ENV && \
    ls -la $VIRTUAL_ENV/bin && \
    test -f $PYTHON_PATH && \
    echo "Python executable located at: $PYTHON_PATH"

# Test Python environment
RUN $PYTHON_PATH --version && \
    echo "Python environment verified successfully"

# Use the virtual environment's pip explicitly with the correct path
RUN $VIRTUAL_ENV/bin/pip3 install --upgrade pip && \
    $VIRTUAL_ENV/bin/pip3 install wheel setuptools && \
    $VIRTUAL_ENV/bin/pip3 install pandas numpy pydicom && \
    $VIRTUAL_ENV/bin/pip3 install --no-cache-dir -r python_env/requirements.txt

# Test
RUN python3 -c "import pydicom; import numpy; import pandas" && \
    echo "Python environment verified successfully"

# Install Node dependencies
RUN yarn add @mui/lab zod && \
    yarn install --frozen-lockfile
    
# Build the application
RUN yarn build


# Make start script executable
RUN chmod +x ./scripts/start-db.sh
CMD ["yarn","start-db"]
# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]

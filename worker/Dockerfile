FROM python:3.13-slim AS builder

# Install system dependencies needed for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN uv pip install --system --python python3.13 -r requirements.txt && \
    find /usr/local/lib/python3.13/site-packages/torch -name "*.a" -delete && \
    find /usr/local/lib/python3.13/site-packages/torch -name "*.h" -delete && \
    find /usr/local/lib/python3.13/site-packages/torch -name "*.hpp" -delete && \
    find /usr/local/lib/python3.* -type d -name 'tests' -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local/lib/python3.* -type d -name 'test' -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local/lib/python3.* -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true && \
    rm -rf /root/.cache/pip

# Copy application code
COPY . .

# Runtime stage
FROM python:3.13-slim

WORKDIR /app

# Install Node.js, ffmpeg and FFmpeg development libraries for torchcodec
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    libavcodec-dev \
    libavformat-dev \
    libavutil-dev \
    libswresample-dev \
    && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy installed dependencies and application
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY --from=builder /app .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Verify installations
RUN python --version && node --version && ffmpeg -version

# Run the application
CMD ["python", "main.py"]
FROM nvidia/cuda:12.9.1-runtime-ubuntu24.04 AS builder

# Copy uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy Python 3.12 from official image (PyTorch doesn't support 3.13 yet)
COPY --from=python:3.12-slim /usr/local/bin/python3.12 /usr/local/bin/
COPY --from=python:3.12-slim /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=python:3.12-slim /usr/local/lib/libpython3.12.so* /usr/local/lib/
RUN ln -s /usr/local/bin/python3.12 /usr/local/bin/python3 && \
    ln -s /usr/local/bin/python3.12 /usr/local/bin/python && \
    ldconfig

# Copy Node.js (runtime only)
COPY --from=node:24-slim /usr/local/bin/node /usr/local/bin/

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN uv pip install --system --python python3.12 -r requirements.txt && \
    find /usr/local/lib/python3.* -type d -name 'tests' -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local/lib/python3.* -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true

# Copy application code
COPY . .

# Runtime stage
FROM nvidia/cuda:12.9.1-runtime-ubuntu24.04

# Copy Python 3.12 runtime (including shared libraries and SSL)
COPY --from=python:3.12-slim /usr/local/bin/python3.12 /usr/local/bin/
COPY --from=python:3.12-slim /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=python:3.12-slim /usr/local/lib/libpython3.12.so* /usr/local/lib/
# Copy SSL libraries from Python image to fix OpenSSL version mismatch
COPY --from=python:3.12-slim /usr/lib/x86_64-linux-gnu/libssl.so* /usr/lib/x86_64-linux-gnu/
COPY --from=python:3.12-slim /usr/lib/x86_64-linux-gnu/libcrypto.so* /usr/lib/x86_64-linux-gnu/
RUN ln -s /usr/local/bin/python3.12 /usr/local/bin/python3 && \
    ln -s /usr/local/bin/python3.12 /usr/local/bin/python && \
    ldconfig

# Copy Node.js runtime
COPY --from=node:24-slim /usr/local/bin/node /usr/local/bin/

WORKDIR /app

# Install runtime dependencies (ffmpeg for yt-dlp)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy installed dependencies and application
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Run the application
CMD ["python", "main.py"]
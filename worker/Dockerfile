FROM pytorch/pytorch:2.10.0-cuda13.0-cudnn9-runtime AS builder

# Copy uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy Node.js (runtime only)
COPY --from=node:24-slim /usr/local/bin/node /usr/local/bin/

WORKDIR /app

# Install Python dependencies (exclude torch/torchaudio as they're in base image)
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt && \
    find /opt/conda/lib/python3.* -type d -name 'tests' -exec rm -rf {} + 2>/dev/null || true && \
    find /opt/conda/lib/python3.* -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true

# Copy application code
COPY . .

# Runtime stage
FROM pytorch/pytorch:2.10.0-cuda13.0-cudnn9-runtime

# Copy Node.js runtime
COPY --from=node:24-slim /usr/local/bin/node /usr/local/bin/

WORKDIR /app

# Install runtime dependencies (ffmpeg for yt-dlp)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy installed dependencies and application
COPY --from=builder /opt/conda/lib/python3.*/site-packages /opt/conda/lib/python3.12/site-packages
COPY --from=builder /opt/conda/bin /opt/conda/bin
COPY --from=builder /app .

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Run the application
CMD ["python", "main.py"]
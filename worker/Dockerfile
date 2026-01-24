# ビルドステージ
FROM nvidia/cuda:12.9.1-runtime-ubuntu24.04 AS builder

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
# Node.jsを公式イメージからコピー（最軽量）
COPY --from=node:24-slim /usr/local/bin/node /usr/local/bin/
COPY --from=node:24-slim /usr/local/lib/node_modules /usr/local/lib/node_modules

# npmとnpxのシンボリックリンク作成
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
    ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python依存のインストール
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt && \
    find /usr/local/lib/python3.* -type d -name 'tests' -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local/lib/python3.* -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true

# Node.js依存のインストール（package.jsonがある場合）
COPY package*.json ./
RUN if [ -f package.json ]; then \
    npm ci --omit=dev && \
    npm cache clean --force; \
    fi

# 最終ステージ
FROM nvidia/cuda:12.9.1-runtime-ubuntu24.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    NODE_ENV=production

# 最小限のシステム依存
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    ffmpeg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Node.jsバイナリとライブラリをコピー
COPY --from=builder /usr/local/bin/node /usr/local/bin/
COPY --from=builder /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
    ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# Pythonライブラリをコピー
COPY --from=builder /usr/local/lib/python3.10 /usr/local/lib/python3.10
COPY --from=builder /usr/local/bin /usr/local/bin

WORKDIR /app

# node_modulesをコピー（存在する場合）
COPY --from=builder /app/node_modules ./node_modules

# アプリケーションコードをコピー
COPY . .

ENTRYPOINT ["python3", "main.py"]
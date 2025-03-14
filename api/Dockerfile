# ベースイメージをCUDA対応のものに変更し、Python 3.11を明示的にインストール
FROM nvidia/cuda:12.2.2-runtime-ubuntu22.04 AS base

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Pythonのデフォルトを3.11に設定
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

# 環境変数の設定
ENV PATH="/venv/bin:$PATH"

FROM base AS builder

WORKDIR /usr/src/app

RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

RUN pip install --upgrade pip

COPY ./heavy-requirements.txt .
RUN pip install -r heavy-requirements.txt

COPY ./custom-requirements.txt .
RUN pip install -r custom-requirements.txt

COPY . .
RUN pip install .

FROM base AS service
WORKDIR /root/app
COPY --from=builder /venv /venv
ENV PATH=/venv/bin:$PATH

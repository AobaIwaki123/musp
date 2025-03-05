FROM python:3.11 AS base

WORKDIR /app

COPY requirements.txt requirements-heavy.txt ./

RUN apt-get update && apt-get install -y ffmpeg

RUN pip install -r requirements-heavy.txt
RUN pip install -r requirements.txt

FROM base AS dev

COPY . .

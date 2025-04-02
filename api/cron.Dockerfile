FROM python:3.11-slim AS base

ENV CRON_INTERVAL_MINUTE=60

RUN pip install -U pip

WORKDIR /app

COPY ./cron.requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY ./src/cron_job ./cron_job
COPY ./src/openapi_server/cloud_storage ./src/openapi_server/cloud_storage
COPY ./src/openapi_server/models/custom ./src/openapi_server/models/custom

COPY ./pyproject.toml ./pyproject.toml
COPY ./cron.setup.cfg ./setup.cfg

RUN pip install .

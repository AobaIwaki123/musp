FROM python:3.11 AS builder

WORKDIR /usr/src/app

RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

RUN pip install --upgrade pip

COPY ./pyproject.toml ./requirements.txt ./setup.cfg ./
COPY ./src ./src
RUN pip install --no-cache-dir .


FROM python:3.11 AS custom-requirements
WORKDIR /tmp
COPY --from=builder /venv /venv
ENV PATH=/venv/bin:$PATH

COPY ./heavy-requirements.txt .
RUN pip install -r heavy-requirements.txt

COPY ./custom-requirements.txt .
RUN pip install -r custom-requirements.txt

FROM python:3.11 AS service
WORKDIR /root/app
COPY --from=custom-requirements /venv /venv
ENV PATH=/venv/bin:$PATH

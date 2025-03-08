build:
	@echo "Building..."
	@docker compose build
	@echo "Built"

up:
	@echo "Starting..."
	@docker compose up -d
	@echo "Started"

down:
	@echo "Stopping..."
	@docker compose down
	@echo "Stopped"

restart:
	@echo "Restarting..."
	@docker compose down
	@docker compose up -d
	@echo "Restarted"

logs:
	@docker compose logs -f

lint:
	@docker -v ./view/:/code ghcr.io/biomejs/biome:1.9.4 lint

gen-py:
	@sudo docker run --rm -v ./:/local openapitools/openapi-generator-cli generate -i /local/openapi.yaml -g python-fastapi -o /local/api

gen-ts:
	@sudo docker compose run --rm view openapi-zod-client openapi.yaml --output src/client/client.ts

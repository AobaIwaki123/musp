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

lint-ts:
	@docker -v ./view/:/code ghcr.io/biomejs/biome:1.9.4 lint

lint-py:
	@sudo docker run --rm -v ./:/code pipelinecomponents/ruff ruff format

gen-py:
	@sudo find api/src/openapi_server/models -maxdepth 1 -type f -delete
	@sudo docker run --rm -v ./:/local openapitools/openapi-generator-cli generate -i /local/openapi.yaml -g python-fastapi -o /local/api
	@sudo chown $(USER) -R .

gen-ts:
	@sudo docker compose run --rm view openapi-zod-client openapi.yaml --output src/client/client.ts -t src/client/template.hbs

gen:
	@make gen-py
	@make gen-ts

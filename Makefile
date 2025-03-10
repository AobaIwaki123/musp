build:
	@echo "Building..."
	@docker compose build
	@echo "Built"

prod-build:
	@echo "Building..."
	@docker compose -f compose.prod.yml build
	@echo "Built"

up:
	@echo "Starting..."
	@docker compose up -d
	@echo "Started"

prod-up:
	@echo "Starting..."
	@docker compose -f compose.prod.yml up -d
	@echo "Started"

down:
	@echo "Stopping..."
	@docker compose down
	@echo "Stopped"

prod-down:
	@echo "Stopping..."
	@docker compose -f compose.prod.yml down
	@echo "Stopped"

restart:
	@echo "Restarting..."
	@docker compose down
	@docker compose up -d
	@echo "Restarted"

prod-restart:
	@echo "Restarting..."
	@docker compose -f compose.prod.yml down
	@docker compose -f compose.prod.yml up -d
	@echo "Restarted"
	
logs:
	@docker compose logs -f

lint-ts:
	@sudo docker compose run --rm view pnpm biome format --write

lint-py:
	@sudo docker run --rm -v ./:/code pipelinecomponents/ruff ruff format

gen-py:
	@sudo find api/src/openapi_server/models -maxdepth 1 -type f -delete
	@sudo docker run --rm -v ./:/local openapitools/openapi-generator-cli generate -i /local/openapi.yaml -g python-fastapi -o /local/api -t /local/api/templates
	@sudo chown $(USER) -R .

gen-ts:
	@sudo docker compose run --rm view openapi-zod-client openapi.yaml --output src/client/client.ts -t templates/zod-openapi-client.hbs

gen:
	@make gen-py
	@make gen-ts

prune-br:
	@git remote prune origin
	@git branch | xargs git branch -d

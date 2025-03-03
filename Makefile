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

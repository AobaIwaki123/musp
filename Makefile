lint-ts:
	@docker -v ./view/:/code ghcr.io/biomejs/biome:1.9.4 lint

lint-py:
	@sudo docker run --rm -v ./:/code pipelinecomponents/ruff ruff format

gen-py:
	@sudo find api-v2/src/openapi_server/models -maxdepth 1 -type f -delete
	@sudo find api-v2/src/openapi_server/apis -maxdepth 1 -type f -delete
	@sudo docker run --rm -v ./:/local openapitools/openapi-generator-cli generate -i /local/openapi.yaml -g python-fastapi -o /local/api-v2 -t /local/api-v2/templates
	@sudo chown $(USER) -R .

gen-ts:
	@sudo docker compose run --rm view npx openapi-zod-client openapi.yaml --output client/client.ts -t templates/zod-openapi-client.hbs
	@sudo docker compose run --rm view npx openapi-zod-client /app/integration/youtube/openapi.yml --output client/youtube.client.ts -t templates/youtube.hbs

gen:
	@make gen-py
	@make gen-ts

prune-br:
	@git remote prune origin
	@git branch | xargs git branch -d

PROJECT_B_ID := musp-485206

push-worker:
	@gcloud builds submit --project ${PROJECT_B_ID}\
		--tag gcr.io/${PROJECT_B_ID}/musp-worker:latest worker/

test-worker:
	curl -X POST https://asia-northeast1-musp-485206.cloudfunctions.net/vm-launcher -H "Content-Type: application/json" -d '{"trigger": "api"}'

k8s-secret:
	@cp k8s/secret.template.yaml k8s/secret.yaml
	@echo "k8s/secret.yaml created. Please edit it with your secrets."

view-deploy: view-build view-push view-reload

view-build:
	@docker build \
  --platform linux/amd64 \
  $(shell grep -v '^\#' view/.env.production | sed 's/^/--build-arg /' | tr '\n' ' ') \
  -t gcr.io/my-docker-471807/musp-view:latest \
  view/
	@echo "View image built and tagged as gcr.io/my-docker-471807/musp-view:latest"

view-push:
	@docker push gcr.io/my-docker-471807/musp-view:latest
	@echo "View image pushed to gcr.io/my-docker-471807/musp-view:latest"

view-reload:
	@kubectl rollout restart deployment musp-view -n musp
	@echo "View deployment restarted."
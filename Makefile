.PHONY: help build run dev stop clean logs push

# Variables
IMAGE_NAME = invoice-system
CONTAINER_NAME = invoice-system
PORT = 3000
DEV_PORT = 5173

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker image for production
	docker build -t $(IMAGE_NAME):latest .

run: ## Run production container
	docker-compose up app -d

dev: ## Run development container with hot reload
	docker-compose --profile dev up app-dev

stop: ## Stop all containers
	docker-compose down

clean: ## Clean up containers and images
	docker-compose down --rmi all --volumes

logs: ## Show container logs
	docker-compose logs -f

push: ## Push image to registry (configure registry first)
	docker tag $(IMAGE_NAME):latest your-registry/$(IMAGE_NAME):latest
	docker push your-registry/$(IMAGE_NAME):latest

test: ## Run tests in Docker
	docker run --rm -v $(PWD):/app -w /app node:20-alpine sh -c "npm ci && npm run lint"

shell: ## Open shell in running container
	docker exec -it $(CONTAINER_NAME) sh
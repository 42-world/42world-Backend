SERVICE_NAME = 42world
COMPOSE_FILE = -f ./infra/docker-compose.yml
ENV_FILE = --env-file ./infra/config/.env

.PHONY: all
all: dev

# Development =================================================
.PHONY: ready
ready:
	cp ./infra/config/.env.dev ./infra/config/.env
	docker-compose $(COMPOSE_FILE) $(ENV_FILE) up -d db
	docker-compose $(COMPOSE_FILE) $(ENV_FILE) up -d redis
	./infra/wait-for-healthy.sh 42world-backend-db

.PHONY: dev
dev: dev-api

.PHONY: dev-api
dev-api: ready
	yarn start:dev api

.PHONY: dev-admin
dev-admin: ready
	yarn start:dev admin

.PHONY: dev-batch
dev-batch: ready
	yarn start:dev batch

.PHONY: clean
clean:
	docker-compose $(COMPOSE_FILE) down

.PHONY: clean-all
clean-all: clean
	rm -rf infra/db dist

# Test =================================================
.PHONY: test
test:
	-cp ./infra/config/.env.test ./infra/config/.env
	./infra/run_test_db.sh
	./infra/wait-for-healthy.sh ft_world-mysql-test
	yarn test:e2e ./apps/api/test/e2e/*.e2e-spec.ts

# Alpha & Production =================================================
.PHONY: alpha
alpha:
	cp ./infra/config/.env.alpha ./infra/config/.env
	docker-compose $(COMPOSE_FILE) $(ENV_FILE) config | docker stack deploy $(SERVICE_NAME) -c -

.PHONY: prod
prod:
	cp ./infra/config/.env.prod ./infra/config/.env
	docker-compose $(COMPOSE_FILE) $(ENV_FILE) config | docker stack deploy $(SERVICE_NAME) -c -

# Build =================================================
build-api:
	docker build -t 42world/backend-api:latest -f ./infra/api.Dockerfile . --platform linux/x86_64
	docker push 42world/backend-api:latest

build-admin:
	docker build -t 42world/backend-admin:latest -f ./infra/admin.Dockerfile . --platform linux/x86_64
	docker push 42world/backend-admin:latest

build-batch:
	docker build -t 42world/backend-batch:latest -f ./infra/batch.Dockerfile . --platform linux/x86_64
	docker push 42world/backend-batch:latest

# Swarm =================================================

.PHONY:	swarm-init
swarm-init:
	docker swarm init

.PHONY:	swarm-leave
swarm-leave:
	docker swarm leave --force

.PHONY: swarm-clean
swarm-clean:
	docker service rm $(shell docker service ls -q)

.PHONY: swarm-clean-all
swarm-clean-all: swarm-clean
	rm -rf infra/db dist

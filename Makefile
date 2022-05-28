COMPOSE = docker-compose
COMPOSE_ENV = ${COMPOSE} --env-file config/.env

.PHONY: test

init:
	docker swarm init

leave:
	docker swarm leave --force

test:
	-cp ./infra/config/.env.test ./infra/config/.env
	./infra/run_test_db.sh
	./infra/wait-for-healthy.sh ft_world-mysql-test
	yarn test:e2e ./apps/api/test/e2e/*.e2e-spec.ts

dev:
	cp ./infra/config/.env.dev ./infra/config/.env
	make db redis
	mkdir -p db
	./infra/wait-for-healthy.sh 42world-backend-db
	yarn start:dev api

dev-batch:
	cp ./infra/config/.env.dev ./infra/config/.env
	make db redis
	./infra/wait-for-healthy.sh 42world-backend-db
	yarn start:dev batch

alpha:
	cp ./infra/config/.env.alpha ./infra/config/.env
	mkdir -p db
	docker build -t 42world-backend-api -f ./infra/api.Dockerfile .
	docker stack deploy --compose-file ./infra/docker-stack-alpha.yml alpha-stack

prod:
	cp ./infra/config/.env.prod ./infra/config/.env
	mkdir -p db
	docker stack deploy --compose-file ./infra/docker-stack-prod.yml prod-stack

prod-build:
	docker build -t 42world/backend-api:latest .

prod-push:
	docker push 42world/backend-api:latest

db-dev:
	cd infra && export NODE_ENV=dev && $(call COMPOSE_ENV) up --build -d db

db-alpha:
	docker service update alpha-stack_db

db: db-dev

db-down:
	${COMPOSE} down db

api:
	api-dev

api-dev:
	cd infra && export NODE_ENV=dev && $(call COMPOSE_ENV) up --build --no-deps -d api

api-alpha:
	docker service update alpha-stack_api

api-prod:
	docker service update prod-stack_api

api-build:
	docker build -t ft-world-api -f ./infra/api.Dockerfile .
	docker tag ft-world-api:latest public.ecr.aws/x9y9d0k9/ft-world-api:latest
	docker push public.ecr.aws/x9y9d0k9/ft-world-api:latest

db-init:
	yarn typeorm:run
	yarn seed

redis: redis-dev

redis-down:
	${COMPOSE} down redis

redis-dev:
	cd infra && export NODE_ENV=dev && $(call COMPOSE_ENV) up --build -d redis

clean:
	cd infra && ${COMPOSE} down

clean-all: clean
	rm -rf db dist

swarm-clean:
	docker service rm $(shell docker service ls -q)

swarm-clean-all: swarm-clean
	rm -rf db dist

.PHONY: db

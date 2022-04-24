COMPOSE = docker-compose
COMPOSE_ENV = ${COMPOSE} --env-file config/.env

.PHONY: test

init:
	sudo docker swarm init

test:
	./run_test_db.sh
	./wait-for-healthy.sh ft_world-mysql-test
	yarn test:e2e ./apps/api/test/e2e/*.e2e-spec.ts

dev:
	cp ./config/.env.dev ./config/.env
	make db redis
	mkdir -p db
	./wait-for-healthy.sh 42world-backend-db
	yarn start:dev api

alpha:
	cp ./config/.env.alpha ./config/.env
	mkdir -p db
	docker build -t 42world-backend-api .
	docker stack deploy --compose-file docker-stack-alpha.yml alpha-stack

prod:
	cp ./config/.env.prod ./config/.env
	mkdir -p db
	docker stack deploy --compose-file docker-stack-prod.yml prod-stack

db-dev:
	export NODE_ENV=dev && $(call COMPOSE_ENV) up --build -d db

db-alpha:
	sudo docker service update alpha-stack_db

db: db-dev

db-down:
	${COMPOSE} down db

api:
	api-dev

api-dev:
	export NODE_ENV=dev && $(call COMPOSE_ENV) up --build --no-deps -d api

api-alpha:
	sudo docker service update alpha-stack_api

api-prod:
	sudo docker service update prod-stack_api

api-build:
	sudo docker build -t ft-world-api .
	sudo docker tag ft-world-api:latest public.ecr.aws/x9y9d0k9/ft-world-api:latest
	sudo docker push public.ecr.aws/x9y9d0k9/ft-world-api:latest

db-init:
	sudo yarn typeorm:run
	sudo yarn seed

redis: redis-dev

redis-down:
	${COMPOSE} down redis

redis-dev:
	export NODE_ENV=dev && $(call COMPOSE_ENV) up --build -d redis

clean:
	${COMPOSE} down

clean-all: clean
	sudo rm -rf db dist

.PHONY: db

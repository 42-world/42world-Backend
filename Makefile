COMPOSE = docker-compose
COMPOSE_ENV = ${COMPOSE} --env-file config/.env

dev:
	cp ./config/.env.dev ./config/.env
	make db redis
	yarn start:dev

alpha:
	cp ./config/.env.alpha ./config/.env
	export NODE_ENV=alpha && sudo $(call COMPOSE_ENV) up --build -d

prod:
	cp ./config/.env.prod ./config/.env
	make api-prod

db-dev:
	export NODE_ENV=dev && $(call COMPOSE_ENV) up --build -d db

db-alpha:
	export NODE_ENV=alpha && sudo $(call COMPOSE_ENV) up --build -d db

db: db-dev

db-down:
	${COMPOSE} down db

redis: redis-dev

redis-down:
	${COMPOSE} down redis

redis-dev:
	export NODE_ENV=dev && $(call COMPOSE_ENV) up --build -d redis

redis-alpha:
	export NODE_ENV=alpha && sudo $(call COMPOSE_ENV) up --build -d redis

api:
	api-dev

api-dev:
	export NODE_ENV=dev && $(call COMPOSE_ENV) up --build --no-deps -d api

api-alpha:
	export NODE_ENV=alpha && sudo $(call COMPOSE_ENV) up --build --no-deps -d api

api-prod:
	sudo docker build -t ft-world-api .
	sudo docker run -d -p 80:80 --env-file config/.env ft-world-api

api-build:
	sudo docker build -t ft-world-api .
	sudo docker tag ft-world-api:latest public.ecr.aws/x9y9d0k9/ft-world-api:latest
	sudo docker push public.ecr.aws/x9y9d0k9/ft-world-api:latest

db-init:
	sudo yarn typeorm:run
	sudo yarn seed

clean:
	${COMPOSE} down

clean-all: clean
	sudo rm -rf db dist

.PHONY: db

COMPOSE = sudo docker-compose
COMPOSE_ENV = ${COMPOSE} --env-file config/$(1).env

dev: db redis
	sudo yarn start:dev

alpha:
	export NODE_ENV=alpha && $(call COMPOSE_ENV,alpha) up --build -d

prod:
	export NODE_ENV=prod && $(call COMPOSE_ENV,alpha) up --build -d

db-dev:
	$(call COMPOSE_ENV,dev) up --build -d db

db-alpha:
	$(call COMPOSE_ENV,alpha) up --build -d db

db-prod:
	$(call COMPOSE_ENV,prod) up --build -d db

db: db-dev

db-down:
	${COMPOSE} down db

redis: redis-dev

redis-down:
	${COMPOSE} down redis

redis-dev:
	$(call COMPOSE_ENV,dev) up --build -d redis

redis-alpha:
	$(call COMPOSE_ENV,alpha) up --build -d redis

redis-prod:
	$(call COMPOSE_ENV,prod) up --build -d redis

api:
	api-dev

api-dev:
	$(call COMPOSE_ENV,dev) up --build --no-deps -d api

api-alpha:
	$(call COMPOSE_ENV,alpha) up --build --no-deps -d api

api-prod:
	$(call COMPOSE_ENV,prod) up --build --no-deps -d api

db-init:
	sudo yarn typeorm:run
	sudo yarn seed

test-db:
	${COMPOSE} -f docker-compose-test.yml -d

clean:
	${COMPOSE} down

clean-all: clean
	sudo rm -rf db dist

.PHONY: db

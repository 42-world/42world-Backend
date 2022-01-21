COMPOSE = sudo docker-compose
COMPOSE_ENV = ${COMPOSE} --env-file config/$(1).env

dev: db
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

api-dev:
	$(call COMPOSE_ENV,dev) up --build --no-deps -d api

api-alpha:
	$(call COMPOSE_ENV,alpha) up --build --no-deps -d api

api-prod:
	$(call COMPOSE_ENV,prod) up --build --no-deps -d api

api:
	api-dev

db-init:
	sudo yarn typeorm:run
	sudo yarn seed

clean:
	${COMPOSE} down

clean-all: clean
	sudo rm -rf db dist

.PHONY: db

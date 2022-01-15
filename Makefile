all:
	yarn build
	docker-compose --env-file config/compose.env up --build -d

db:
	docker-compose --env-file config/compose.env up --build -d db

db-down:
	docker-compose down db

api:
	yarn build
	docker-compose up --build -d api

api-up:
	docker-compose up --build -d api

api-down:
	docker-compose down api

db-init:
	yarn typeorm:run
	yarn seed

clean:
	docker-compose down

clean-all: clean
	rm -rf db dist

.PHONY: db
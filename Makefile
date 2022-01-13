db :
	docker compose --env-file src/config/.env.db up -d

db-down :
	docker compose down

db-init :
	yarn typeorm:run
	yarn seed

.PHONY : db
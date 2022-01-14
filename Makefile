db :
	docker compose --env-file config/db.env up -d

db-down :
	docker compose down

db-init :
	yarn typeorm:run
	yarn seed

.PHONY : db
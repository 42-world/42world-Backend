#!/usr/bin/env bash

docker run -d --rm --name ft_world-mysql-test \
-e MYSQL_DATABASE=ft_world \
-e MYSQL_USER=ft_world \
-e MYSQL_PASSWORD=ft_world \
-e MYSQL_ALLOW_EMPTY_PASSWORD=true \
-e MYSQL_INITDB_ARGS=--encoding=UTF-8 \
-e TZ=Asia/Seoul \
-p 3308:3306 mysql:5.7
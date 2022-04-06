#!/usr/bin/env bash

if ! $( docker container inspect -f '{{.State.Running}}' ft_world-mysql-test 2> /dev/null ); then
    docker run -d --rm --name ft_world-mysql-test \
        --platform linux/x86_64 \
        -e MYSQL_DATABASE=ft_world \
        -e MYSQL_USER=ft_world \
        -e MYSQL_PASSWORD=ft_world \
        -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
        -e MYSQL_INITDB_ARGS=--encoding=UTF-8 \
        -e TZ=Asia/Seoul \
        -p 3308:3306 mysql:5.7 \
        mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
fi
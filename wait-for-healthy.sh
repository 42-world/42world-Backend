#!/usr/bin/env bash

container_name=$1

is_db_healthy() {
    test "$( docker container inspect -f '{{.State.Health.Status}}' $container_name )" == "healthy"
}

wait_for()
{
    if is_db_healthy; then
        return 0
    fi
    while :
    do
        echo "waiting for healthy db..."
        if is_db_healthy; then
            sleep 5
            echo "waiting done!"
            break
        fi
        sleep 5
    done
}

wait_for
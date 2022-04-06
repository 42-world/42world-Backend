#!/usr/bin/env bash

container_name=$1

wait_for()
{
    while :
    do
        if [ "$( docker container inspect -f '{{.State.Health.Status}}' $container_name )" == "healthy" ]; then
            sleep 5
            echo "waiting done!"
            break
        fi
        sleep 5
        echo "waiting for healthy db..."
    done
}

wait_for
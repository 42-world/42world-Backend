#!/usr/bin/env bash
set -e

PHASE=${1:-alpha}

aws ecs update-service --cluster Rookies-alpha-api --service Rookies-${PHASE}-api --task-definition Rookies-${PHASE}-api --force-new-deployment
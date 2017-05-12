#!/usr/bin/env bash
set -e
docker-compose up -d
webpack
nodemon ./bin/vimes -- -i ~/surfdrive/DANS/target/flattened/

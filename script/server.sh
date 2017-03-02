#!/usr/bin/env bash
mongod --fork --logpath ./mongodb.log --logappend
webpack
nodemon ./bin/vimes -- -i ~/surfdrive/DANS/target/flattened/

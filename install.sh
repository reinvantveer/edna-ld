#!/usr/bin/env bash
set -e
git submodule init
git submodule update
npm install
cd ld-transformer && npm install
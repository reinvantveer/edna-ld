#!/usr/bin/env bash
webpack edna-ld-gui/src/app.js edna-ld-gui/public/js/app.js
nodemon edna-ld-gui/bin/vimes -- -i ~/surfdrive/DANS/target/flattened/
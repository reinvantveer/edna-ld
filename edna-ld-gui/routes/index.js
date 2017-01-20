const express = require('express');
const graphLoader = require('../lib/graphLoader');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { graph: JSON.stringify(graphLoader(`${__dirname}/../public/data/graph.json`, null, 2)) });
});

module.exports = router;

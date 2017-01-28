const express = require('express');
const graphLoader = require('../lib/graphLoader');

const router = express.Router();

router.get('/', (req, res) => {
  return res.render('index', { title: 'Home' });
});

router.get('/mapping', (req, res) => {
  return res.render('mapping', { title: 'Schema mapping' });
});

router.get('/sourcedata', (req, res) => {
  return res.render('sourcedata', { title: 'Source files and data' });
});

router.get('/targetdata', (req, res) => {
  return res.render('targetdata', { title: 'Mapped data' });
});

router.get('/schema', (req, res) => {
  return res.render('schema', {
    title: 'File schema graph',
    graph: JSON.stringify(graphLoader(`${__dirname}/../public/data/graph.json`, null, 2))
  });
});

module.exports = router;

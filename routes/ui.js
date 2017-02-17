const express = require('express');
const graphLoader = require('../lib/graphLoader');

const argv = require('yargs')
  .usage('Usage: $0 -i [input folder path] -e [file extension filter]')
  .describe('i', 'Input path to recursively search for CSVs')
  .describe('e', 'File extension to search for')
  .default('e', 'csv')
  .demand(['i'])
  .argv;

const router = express.Router();

router.get('/', (req, res) => res.render('index', {
  title: 'Home',
  path: argv.i,
  extension: argv.e
}));

router.get('/mapping', (req, res) => res.render('mapping', { title: 'Schema mapping' }));

router.get('/sourcedata', (req, res) => res.render('sourcedata', { title: 'Source files and data' }));

router.get('/targetdata', (req, res) => res.render('targetdata', { title: 'Mapped data' }));

router.get('/schema', (req, res) => res.render('schema', {
  title: 'File schema graph',
  graph: JSON.stringify(graphLoader(`${__dirname}/../public/data/graph.json`, null, 2))
}));

module.exports = router;

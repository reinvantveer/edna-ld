const express = require('express');

const router = express.Router();

router.get('/files', (req, res) => {
  res.json({ response: 'respond with a resource' });
});

router.get('/sourcedata', (req, res) => {
  res.json({ response: 'respond with a resource' });
});

module.exports = router;

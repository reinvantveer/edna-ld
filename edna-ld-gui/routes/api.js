'use strict';

const express = require('express');

const router = express.Router({
  mergeParams: true
});

// Mongodb setup
const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017/edna-ld';

MongoClient.connect(dbUrl)
  .then(mongodb => {
    const collections = {
      schemaCollection: mongodb.collection('schemas'),
      fileCollection: mongodb.collection('files'),
      sourcedataCollection: mongodb.collection('sourcedata')
    };

    router.get('/files', (req, res) => {
      if (req.query.filepath) {
        return collections.fileCollection.findOne({ filePath: req.query.filepath })
          .then(fileStats => {
            if (fileStats) return res.json(fileStats);
            return res.status(404).json({ error: 'not found' });
          })
          .catch(err => {
            console.log(err);
            return res.json(err);
          });
      }

      return res.json({ hint: 'use with query ?filepath={filepath}' });
    });

    router.get('/sourcedata', (req, res) => {
      if (req.query.filepath) {
        return collections.sourcedataCollection.find({ filePath: req.query.filepath })
          .toArray((err, fileStats) => {
            if (err) {
              console.log(err);
              return res.json(err);
            }
            if (fileStats) return res.json(fileStats);
            return res.status(404).json({ error: 'not found' });
          });
      }

      return res.json({ hint: 'use with query ?filepath={filepath}' });
    });
  });

module.exports = router;

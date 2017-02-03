/**
 * Created by vagrant on 2/3/17.
 */
'use strict';

const schemaAnalyzer = require('csv-ld').schemaAnalyzer;
const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017/edna-ld';
let mongodb;

function setupAnalysisSocket(io) {
  MongoClient.connect(dbUrl)
    .then(db => {
      mongodb = db;

      io.on('connection', socket => {
        socket.on('statusUpdate', msg => io.emit('statusUpdate', msg));

        socket.on('startAnalysis', assignment => {
          schemaAnalyzer.analyzeFolderRecursive(assignment.inputFolder, assignment.extension, db)
            .then(result => io.emit('schemaResult', result))
            .catch(err => io.emit('error', err));
        });
      });
    })
    .catch(err => {
      if (mongodb) mongodb.close();
      console.error(err);
    });
}

module.exports = (io) => setupAnalysisSocket(io);

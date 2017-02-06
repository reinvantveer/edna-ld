/**
 * Created by vagrant on 2/3/17.
 */

const schemaAnalyzer = require('../lib/schemaAnalyzer');
const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://localhost:27017/edna-ld';
let mongodb;

function startAnalysis(assignment, db, socket) {
  socket.emit('statusUpdate', 'starting analysis');

  return schemaAnalyzer
    .analyzeFolderRecursive(assignment.inputFolder, assignment.extension, db, socket)
    .then(result => socket.emit('stagingResult', result.length))
    .catch(err => socket.emit('error', err));
}

function setupAnalysisSocket(io) {
  MongoClient.connect(dbUrl)
    .then(db => {
      mongodb = db;

      io.on('connection', socket => {
        socket.on('inventory', assignment => {
          const fileMap = schemaAnalyzer
            .inventoryFiles(assignment.inputFolder, assignment.extension);
          socket.emit('inventoryResult', fileMap);
        });

        socket.on('startStaging', assignment => startAnalysis(assignment, db, socket));
      });
    })
    .catch(err => {
      if (mongodb) mongodb.close();
      console.error(err);
    });
}

module.exports = (io) => setupAnalysisSocket(io);

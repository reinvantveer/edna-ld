/**
 * Created by vagrant on 2/3/17.
 */

const schemaAnalyzer = require('../lib/schemaAnalyzer');
const MongoClient = require('mongodb').MongoClient;
const co = require('co');

const dbUrl = 'mongodb://localhost:27017/edna-ld';

function startAnalysis(assignment, db, socket) {
  socket.emit('statusUpdate', 'starting analysis');

  return schemaAnalyzer
    .analyzeFolderRecursive(assignment.inputFolder, assignment.extension, db, socket)
    .then(result => socket.emit('stagingResult', result.length))
    .catch(err => socket.emit('error', err));
}

function setupAnalysisSocket(io) {
  return co(function* connect() {
    const mongodb = yield MongoClient.connect(dbUrl);
    io.on('connection', socket => {
      socket.on('inventory', assignment => {
        const fileMap = schemaAnalyzer
          .inventoryFiles(assignment.inputFolder, assignment.extension);
        socket.emit('inventoryResult', fileMap);
      });

      socket.on('startStaging', assignment => startAnalysis(assignment, mongodb, socket));
    });
  });
}

module.exports = (io) => setupAnalysisSocket(io);

/**
 * Created by reinvantveer on 12/5/16.
 */

const file = require('file');
const xtend = require('xtend');
const _ = require('lodash');
const highland = require('highland');
const Duration = require('duration');
const jsonpatch = require('fast-json-patch');
const workerFarm = require('worker-farm');
const os = require('os');
const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'schema analyzer' });

// Custom libs
const upsertMany = require('./mongoWriter').upsertMany;
const schemaSorter = require('./schemaSorter');

// Setup for file processing parallelization
const FARM_OPTIONS = {
  maxCallsPerWorker: Infinity,
  maxConcurrentWorkers: os.cpus().length,
  maxConcurrentCallsPerWorker: 10,
  maxConcurrentCalls: Infinity,
  maxCallTime: Infinity,
  maxRetries: Infinity,
  autoStart: true
};

const csvWorker = workerFarm(FARM_OPTIONS, require.resolve('./csvProcessor.js'));

/**
 * De-duplicates an array of analyzed files and returns the aggregated summary
 * @param analysed An array of files analyzed by the schema analyzer
 * @returns {Array} An array of unique schemas and their associated files
 */
function summarize(analysed) {
  const dedupedMaps = [];
  analysed.forEach(fileMap => {
    if (_.find(dedupedMaps, map => map.hash === fileMap.schemaData.hash)) {
      const index = _.findIndex(dedupedMaps, obj => obj.hash === fileMap.schemaData.hash);
      dedupedMaps[index].files.push(fileMap.schemaData.files[0]);
      dedupedMaps[index].occurrences = dedupedMaps[index].files.length;
      if (dedupedMaps[index].duplication[fileMap.csvData.fileStats.hash]) {
        dedupedMaps[index].duplication[fileMap.csvData.fileStats.hash] += 1;
      } else {
        dedupedMaps[index].duplication[fileMap.csvData.fileStats.hash] = 1;
      }
    } else {
      dedupedMaps.push(xtend(fileMap.schemaData, {
        occurrences: 1,
        duplication: {
          [fileMap.csvData.fileStats.hash]: 1
        }
      }));
    }
  });
  return dedupedMaps;
}

function relate(dedupedMap) {
  return new Promise((resolve) => {
    const relatedMap = dedupedMap
      .map(relateSchema => {
        const diffs = dedupedMap
          .filter(refSchema => refSchema.schema !== relateSchema.schema)
          .map(compareSchema => ({
            schemaHash: compareSchema.hash,
            patch: jsonpatch.compare(compareSchema.schema, relateSchema.schema)
          }))
          .sort((A, B) => schemaSorter(A, B, 'preferAdditions'));

        const closestRelatives = diffs[9] ? diffs.slice(0, 10) : [];
        return xtend(relateSchema, { closestRelatives });
      });
    return resolve(relatedMap);
  });
}

/**
 * Create an array of file paths from a given folder location
 * @param folder the input folder to recursively search
 * @param fileTypeExtension the file extension to filter on
 * @returns {Array}
 */
function inventoryFiles(folder, fileTypeExtension) {
  const fileMap = [];

// TODO: test for folder existence
  file.walkSync(folder, (startDir, dirs, fileNames) => {
    const extensionLength = fileTypeExtension.length;
    fileNames
      .filter(fileName => fileName.slice(-extensionLength) === fileTypeExtension)
      .forEach(fileName => {
        let filePath = `${startDir}/${fileName}`;
        filePath = filePath.replace('//', '/');
        fileMap.push(filePath);
      });
  });

  return fileMap;
}

function workerPromise(filePath, collections, socket) {
  // highland requires extra wrapping in a promise
  return new Promise((resolve, reject) => {
    csvWorker(filePath, (err, result) => {
      if (err) return reject(err);
      socket.emit('processedFile', filePath);
      return upsertMany([result.csvData.fileStats], collections.fileCollection)
        .then(() => Promise.all(
          /* eslint no-underscore-dangle: 0 */
          // The underscore is standard for Mongodb
          result.csvData.data.map(row => collections.sourcedataCollection.updateOne(
            { _id: row._id },
            { $set: row },
            { upsert: true }
          ))
        ))
        .then(() => resolve(result))
        .catch(reject);
    });
  });
}

function analyzeFolderRecursive(folder, fileTypeExtension, mongodb, socket) {
  return new Promise((resolve, reject) => {
    const collections = {
      schemaCollection: mongodb.collection('schemas'),
      fileCollection: mongodb.collection('files'),
      sourcedataCollection: mongodb.collection('sourcedata')
    };

    const fileMap = inventoryFiles(folder, fileTypeExtension);

    log.info(`${fileMap.length} files for analysis.`);
    const start = new Date();
    log.info(`Staging and analysis started at ${start.toString()}`);

    const jobStream = fileMap.map(filePath => workerPromise(filePath, collections, socket));

    highland(jobStream)
      .map(job => highland(job))
      .parallel(os.cpus().length)
      .errors(err => console.error(err.stack))
      .toArray(analyzed => {
        relate(summarize(analyzed))
          .then(summarizedHashes => {
            const withId = summarizedHashes.map(schema => {
              // Add mongodb key
              const docWithId = xtend(schema, { _id: schema.hash });
              // Remove Mongodb reserved $schema key
              delete docWithId.schema.$schema;
              return docWithId;
            });
            return upsertMany(withId, collections.schemaCollection);
          })
          .then(summarizedHashes => {
            log.info(`Staging and analysis finished at ${(new Date()).toString()}`);
            const duration = new Duration(start, new Date());
            log.info(`Operation took ${duration.toString(1)}`);

            return resolve(summarizedHashes);
          })
          .catch(err => reject(err));
      });
  });
}

module.exports = {
  inventoryFiles,
  analyzeFolderRecursive,
  workerPromise
};

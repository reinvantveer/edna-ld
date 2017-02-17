/**
 * Created by reinvantveer on 12/5/16.
 */

const file = require('file');
const xtend = require('xtend');
const co = require('co');
const _ = require('lodash');
const H = require('highland');
const jsonpatch = require('fast-json-patch');
const upsertMany = require('./mongoWriter').upsertMany;
const Duration = require('duration');

// Setup for file processing parallelization
const workerFarm = require('worker-farm');
const os = require('os');

const FARM_OPTIONS = {
  maxCallsPerWorker: Infinity,
  maxConcurrentWorkers: os.cpus().length,
  maxConcurrentCallsPerWorker: 10,
  maxConcurrentCalls: Infinity,
  maxCallTime: Infinity,
  maxRetries: Infinity,
  autoStart: true
};

console.log(`${__dirname}/schemaHasher.js`);
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
    } else {
      dedupedMaps.push(xtend(fileMap.schemaData, { occurrences: 1 }));
    }
  });
  return dedupedMaps;
}

/**
 * Sorting function to be passed to Array.prototype.sort()
 * Sorting algorithm for scoring schema differences based on JSON-patch
 * @param diffA The first schema diff patch
 * @param diffB The second schema diff patch
 * @returns {number} The outcome of the scoring.
 *                  -1 if diffA is better, 1 if B is better, 0 if equal scoring
 */
function schemaDiffSorter(diffA, diffB) {
  if (diffA.patch.length > diffB.patch.length) {
    // Only prefer shorter-length diffB if it does something constructive,
    // by adding something somewhere
    if (diffB.patch.findIndex(patchOp => patchOp.op === 'add') >= 0) return 1;
    return -1;
  }
  if (diffA.patch.length < diffB.patch.length) {
    // Only prefer shorter-length diffA if it does something constructive
    if (diffA.patch.findIndex(patchOp => patchOp.op === 'add') >= 0) return -1;
    return 1;
  }
  if (diffA.patch.findIndex(element => element.op === 'remove') >= 0 &&
    diffB.patch.findIndex(element => element.op === 'remove') === -1) return 1;
  if (diffA.patch.findIndex(element => element.op === 'remove') === -1 &&
    diffB.patch.findIndex(element => element.op === 'remove') >= 0) return -1;
  return 0;
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
          .sort(schemaDiffSorter);

        const closestRelatives = diffs[9] ? diffs.slice(0, 10) : [];
        const withRelatives = xtend(relateSchema, { closestRelatives });
        return withRelatives;
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
        console.log(`${startDir}/${fileName}`);
        let filePath = `${startDir}/${fileName}`;
        filePath = filePath.replace('//', '/');
        fileMap.push(filePath);
      });
  });

  return fileMap;
}

function workerPromise(filePath, collections, socket) {
  // Highland requires extra wrapping in a promise
  return new Promise((resolve, reject) => {
    csvWorker(filePath, (err, result) => {
      if (err) return reject(err);
      socket.emit('processedFile', filePath);
      upsertMany([result.csvData.fileStats], collections.fileCollection)
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

function insert(result, collections) {
}

function analyzeFolderRecursive(folder, fileTypeExtension, mongodb, socket) {
  return new Promise((resolve, reject) => {
    const collections = {
      schemaCollection: mongodb.collection('schemas'),
      fileCollection: mongodb.collection('files'),
      sourcedataCollection: mongodb.collection('sourcedata')
    };

    const fileMap = inventoryFiles(folder, fileTypeExtension);

    console.log(`${fileMap.length} files for analysis.`);
    const start = new Date();
    console.log(`Staging and analysis started at ${start.toString()}`);

    const jobStream = fileMap.map(filePath => workerPromise(filePath, collections, socket));

    H(jobStream)
      .map(job => H(job))
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
            console.log(`Staging and analysis finished at ${(new Date()).toString()}`);
            const duration = new Duration(start, new Date());
            console.log(`Operation took ${duration.toString(1)}`);

            return resolve(summarizedHashes);
          })
          .catch(err => reject(err));
      });
  });
}

module.exports = {
  inventoryFiles,
  analyzeFolderRecursive,
  schemaDiffSorter
};

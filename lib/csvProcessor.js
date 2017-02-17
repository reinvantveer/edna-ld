/**
 * Created by reinvantveer on 2/9/17.
 */

const crypto = require('crypto');
const GS = require('generate-schema');
const csvReader = require('./csvReader');
const xtend = require('xtend');

/**
 * Async function
 * @param filePath The path to the csv to be analyzed
 * @param callback Te callback to be called, receiving an error, the csv data and the schema data
 * @returns {callback}
 */
function csvProcessor(filePath, callback) {
  csvReader(filePath)
    .then(csvData => {
      const csvSchema = GS.json(csvData.data);
      delete csvSchema.items.required;
      const schemaJSON = JSON.stringify(csvSchema);

      csvData.data = csvData.data.map(row => xtend(row, {
        filePath,
        _id: crypto.createHash('md5')
          .update(JSON.stringify(row))
          .digest('hex')
      }));

      const schemaData = {
        schema: csvSchema,
        files: [filePath],
        hash: crypto.createHash('md5').update(schemaJSON)
          .digest('hex')
      };

      const result = {
        csvData,
        schemaData
      };
      return callback(null, result);
    })
    .catch(err => callback(err));
}

function dummyCallback(filePath, callback) {
  return callback(null, filePath);
}

module.exports = csvProcessor;

/**
 * Created by reinvantveer on 2/9/17.
 */

const crypto = require('crypto');
const GS = require('generate-schema');
const csvReader = require('./csvReader');

/**
 * Function gathering metadata and contents of a csv file
 * @param filePath The path to the csv to be analyzed
 * @param callback The callback to be returned, receiving an error or the csv and schema data
 * @returns {callback}
 */
function csvProcessor(filePath, callback) {
  csvReader(filePath)
    .then(csvData => {
      const csvSchema = GS.json(csvData.data);
      const ordered = {};

      Object.keys(csvSchema.items.properties)
        .sort()
        .forEach(key => ordered[key] = csvSchema.items.properties[key]);

      csvSchema.items.properties = ordered;
      delete csvSchema.items.required;
      const schemaJSON = JSON.stringify(csvSchema);

      csvData.data.forEach(row => {
        row.filePath = filePath;
        row._id = crypto.createHash('md5')
          .update(JSON.stringify(row))
          .digest('hex');
      });

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

module.exports = csvProcessor;

/**
 * Created by vagrant on 12/5/16.
 */

const csv = require('csv');
const fs = require('fs');
const crypto = require('crypto');

function csvParse(filePath) {
  return new Promise((resolve, reject) => {
    let fileStats;
    try {
      fileStats = fs.statSync(filePath);
    } catch (err) {
      return reject(err);
    }
    const fileData = fs.readFileSync(filePath);

    return csv.parse(fileData, { columns: true }, (parseErr, data) => {
      if (parseErr) {
        console.error(`Error parsing file ${filePath}`);
        fileStats.error = parseErr;
        return reject(parseErr);
      }

      const orderedLowerCase = data.map(row => {
        const orderedRow = {};
        Object.keys(row)
          .sort()
          .forEach((key) => orderedRow[key.toLowerCase()] = row[key]);
        return orderedRow;
      });

      fileStats.filePath = filePath;
      fileStats.hash = crypto.createHash('md5')
        .update(JSON.stringify(orderedLowerCase))
        .digest('hex');
      /* eslint no-underscore-dangle: 0 */
      // Uses _id as Mongodb standard
      fileStats._id = filePath;

      return resolve({ fileStats, data });
    });
  });
}

module.exports = csvParse;

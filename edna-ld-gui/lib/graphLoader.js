/**
 * Created by reinvantveer on 1/16/17.
 */

const fs = require('fs');

module.exports = function (dataPath) {
  const graphData = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(graphData);
};

/**
 * Created by vagrant on 1/28/17.
 */
var path = require('path');

module.exports = {
  entry: {
    schemaApp: './edna-ld-gui/src/schemaApp.js',
    sourcedataApp: './edna-ld-gui/src/sourcedataApp.js'
  },
  output: {
    path: './edna-ld-gui/public/js/',
    filename: '[name].js'
  }
};

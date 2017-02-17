/**
 * Created by vagrant on 1/28/17.
 */
module.exports = {
  entry: {
    schemaApp: './src/schemaApp.js',
    sourcedataApp: './src/sourcedataApp.js',
    indexApp: './src/indexApp.js'
  },
  output: {
    path: './public/js/',
    filename: '[name].js'
  }
};

/**
 * Created by reinvantveer on 1/30/17.
 */

/**
 * Generic mongodb upsert function for multiple documents, based on _id match
 * @param dataArray an array of documents to ingest
 * @param collection
 * @returns {Promise} resolving to the supplied data
 */
function upsertMany(dataArray, collection) {
  return new Promise((resolve, reject) => {
    if (typeof dataArray !== 'object') return reject(new Error(`Expected an array of documents but got "${dataArray}"`));
    if (!dataArray.length) return reject(new Error(`Expected an array of documents but got "${dataArray}"`));
    return Promise.all(
      dataArray.map(record => {
        if (!record._id) return reject(new Error(`Expect to find _id key in ${JSON.stringify(record)}`));
        if (!collection) return reject(new Error(`Expect to find collection, got ${collection}`));
        if (!collection.updateOne) return reject(new Error('Collection has no method "updateOne". Please supply a valid MongoDB collection'));
        return collection.updateOne(
          /* eslint no-underscore-dangle: 0 */
          // The underscore is standard for Mongodb
          { _id: record._id },
          { $set: record },
          { upsert: true }
        );
      }))
      .then(() => resolve(dataArray))
      .catch(err => reject(err));
  });
}

module.exports = { upsertMany };

module.exports = (somevar) =>
  new Promise((resolve, reject) => {
    if (somevar) return resolve(true);
    return reject(false);
  });

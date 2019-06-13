const getInfoboxImage = require('./getInfoboxImage');
const Promise = require('bluebird');
const fs = require('fs');
Promise.promisifyAll(fs);

const getAllImages = (dbRows, type) => {
  return Promise.reduce(
    dbRows,
    (carry, item) => getInfoboxImage(item.id, item.name, type)
      .then(result => (result ? [...carry, result] : carry)),
    []
  )
    .then(filteredQueries => filteredQueries.join('\n'))
    .then(sql => fs.writeFileAsync(`update-logos-${type}.sql`, sql));
}

getAllImages([
  { id: 1, name: 'Rennes' },
  { id: 2, name: 'Nantes' },
  { id: 3, name: 'Toulouse' }
], 'airport');
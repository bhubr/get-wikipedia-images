const getInfoboxImage = require('./getInfoboxImage');

const getAllImages = (dbRows, type) => {
  const promises = dbRows.map(item => getInfoboxImage(item.id, item.name, type));
  return Promise.all(promises)
    .then(updateQueries => updateQueries.filter(item => item !== undefined))
    .then(filteredQueries => filteredQueries.join('\n'));
}

getAllImages([
  { id: 1, name: 'Rennes' },
  { id: 2, name: 'Nantes' },
  { id: 3, name: 'Toulouse' }
], 'airport')
  .then(console.log);
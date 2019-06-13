const axios = require('axios');

const getUrl = (search) => {
  return `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${search}&format=json`;
};

const lookupWikipediaPage = (name, type) => {
  const search = encodeURIComponent(`${name}+${type}`);
  const url = getUrl(search);
  return axios.get(url)
    .then(res => res.data)
    .then(data => {
      const pageTitle = data.query.search[0].title;
      // console.log(data.query.search.map(item => item.title));
      // console.log(pageTitle);
      return pageTitle;
    })
}

// lookupWikipediaPage('Toulouse', 'airport');
module.exports = lookupWikipediaPage;
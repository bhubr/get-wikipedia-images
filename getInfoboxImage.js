const wikiParser = require('wiki-infobox-parser');
const { promisify } = require('util');
const axios = require('axios');
const lookupWikipediaPage = require('./lookupWikipediaPage');
const cheerio = require('cheerio');
const wikiParserAsync = promisify(wikiParser);

const getInfoboxImage = (id, name, type) => lookupWikipediaPage(name, type)
  .then(pageTitle => wikiParserAsync(pageTitle))
  .then(json => JSON.parse(json))
  .then(infobox => `https://commons.wikimedia.org/wiki/File:${infobox.image}`)
  .then(url => axios.get(url))
  .then(res => res.data)
  .then(html => cheerio.load(html))
  .then($ => $('#file > a').attr('href'))
  .then(imageUrl => {
    return `UPDATE ${type} SET logo = '${imageUrl}' WHERE id = ${id}`;
  })
  .catch(err => {
    console.log(name, err.message);
  });

module.exports = getInfoboxImage;
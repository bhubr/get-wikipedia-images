const wikiParser = require('wiki-infobox-parser');
const { promisify } = require('util');
const axios = require('axios');
const lookupWikipediaPage = require('./lookupWikipediaPage');
const cheerio = require('cheerio');

const wikiParserAsync = promisify(wikiParser);

const airports = [
  'Albuquerque',
  'Nantes',
  'Toulouse',
  'Barcelona',
  'Brest',
  'Rennes'
];

const getImageUrl = filename => axios.get(
  `https://en.wikipedia.org/w/api.php?action=query&titles=File:Test.jpg&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url`
)

const getInfoboxImage = (name, type) => lookupWikipediaPage(name, type)
  .then(pageTitle => wikiParserAsync(pageTitle))
  .then(json => JSON.parse(json))
  .then(infobox => `https://commons.wikimedia.org/wiki/File:${infobox.image}`)
  .then(url => axios.get(url))
  .then(res => res.data)
  .then(html => cheerio.load(html))

  .then($ => $('#file > a').attr('href'))
  .catch(err => {
    console.log(name, err.message);
  });

const promises = airports.map(airport => getInfoboxImage(airport, 'airport'));
Promise.all(promises)
  .then(airportInfoboxes => {
    console.log(airportInfoboxes);
    process.exit();
  });

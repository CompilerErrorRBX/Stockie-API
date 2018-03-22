const nlp = require('compromise');

const db = require('../models');
const marketWatchScraper = require('../scrapers/marketwatch');

const articleAPI = (app) => {

  // Gets a list of articles
  // If `limit` is given as a query param it will return `limit` number of results. Default 10.
  // If `offset` is given as a query param it will return `offset` number of results. Default 0.
  app.get('/articles', (req, res, next) => {
    db.Article.findAll({
      attributes: { exclude: ['body'] },
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
      order: [['date_published', 'DESC']],
    }).then((results) => {
      res.status(200).send(results);
    }).catch((err) => {
      res.status(500).send(err);
    });
  });

  app.get('/articles/extract', (req, res, next) => {
    marketWatchScraper(1, 100).then(() => {
      res.status(200).send('Completed article pull');
    });
  });

  app.get('/articles/search', (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const query = req.query.query;

    const normalizedQuery = nlp(query).normalize();

    console.log(`Query: ${query}`);
    console.log(`Normalized: ${normalizedQuery.out('text')}`);
    console.log('Nouns:');
    console.log(normalizedQuery.nouns().out('tags'));
    console.log('Topics:');
    console.log(normalizedQuery.topics().out('freq'));

    console.log('Cleaned');
    console.log(normalizedQuery.nouns()
                               .out('freq')
                               .map((noun) => noun.normal)
                               .join(', '));

    // const smartQuery = natural.PorterStemmer.tokenizeAndStem(query).join(',');
    const smartQuery = normalizedQuery.nouns()
                                      .out('freq')
                                      .map((noun) => `"${noun.normal}"`)
                                      .join(' ');

    db.sequelize.query(
      `SELECT id, author, author_image, date_published, description, publisher, section, thumbnail, title, source, 
        MATCH (title, body, description) AGAINST ('${smartQuery}' IN NATURAL LANGUAGE MODE) AS score
      FROM Articles
      WHERE MATCH (title, body, description) AGAINST ('${smartQuery}' IN NATURAL LANGUAGE MODE)
      ORDER BY score DESC, date_published
      LIMIT ${limit} OFFSET ${offset}`,
      { type: db.Sequelize.QueryTypes.SELECT }).then(articles => {
        res.status(200).send(articles);
      }).catch((err) => {
        // TODO: Remove later as we do not want to expose SQL errors to the front-end.
        res.status(500).send(err);
      });;
  });

  // Gets a list of articles similar to a specific article
  // If `limit` is given as a query param it will return `limit` number of results. Default 10.
  // If `offset` is given as a query param it will return `offset` number of results. Default 0.
  app.get('/article/:id/similar', (req, res, next) => {
    db.Article.findAll({
      where: {
        id: {
          $ne: req.params.id,
        },
      },
      attributes: ['id', 'title', 'author', 'author_image', 'date_published'],
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
      order: [['date_published', 'DESC']],
    }).then((results) => {
      res.status(200).send(results);
    }).catch((err) => {
      res.status(500).send(err);
    });
  });

  // Get an article by id
  app.get('/article/:id', (req, res, next) => {
    db.Article.find({
      where: { id: req.params.id },
      include: [{ model: db.Tag, as: 'Tags' }]
    }).then((result) => {
      if (!result) {
        res.status(404).send('No results found!');
        return;
      }
      const cleanText = nlp(`${result.description} ${result.title} ${result.body}`).normalize();
      console.log(cleanText.topics().out('freq'));
      res.status(200).send(result);
    }).catch((err) => {
      res.status(500).send(err);
    });
  });
}

module.exports = articleAPI;

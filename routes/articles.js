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
    // db.Article.findAll({
    //   where: [`MATCH (author, section, title, body, description) AGAINST ('${req.query.queryß}' IN NATURAL LANGUAGE MODE)`],
    //   // attributes: { exclude: ['body'] },
    //   limit: req.query.limit ? parseInt(req.query.limit) : 10,
    //   offset: req.query.offset ? parseInt(req.query.offset) : 0,
    //   order: [['date_published', 'DESC']],
    // }).then((results) => {
    //   res.status(200).send(results);
    // }).catch((err) => {
    //   res.status(500).send(err);
    // });

    db.sequelize.query(
      `SELECT id, author, author_image, date_published, description, publisher, section, thumbnail, title, source
      FROM Articles 
      WHERE MATCH (title, body, description) AGAINST ('${req.query.query}' IN NATURAL LANGUAGE MODE)
      LIMIT 10`
      , { model: db.Articles }).then(articles => {
        res.status(200).send(articles);
    });
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
    db.Article.findById(req.params.id).then((result) => {
      if (!result) {
        res.status(404).send('No results found!');
        return;
      }
      res.status(200).send(result);
    }).catch((err) => {
      res.status(500).send(err);
    });
  });
}

module.exports = articleAPI;

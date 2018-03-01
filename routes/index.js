const articlesAPI = require('./articles');

const appRouter = (app) => {
  articlesAPI(app);
}

module.exports = appRouter;

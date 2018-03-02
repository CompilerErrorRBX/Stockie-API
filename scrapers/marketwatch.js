const db = require('../models');
const Xray = require('x-ray')();

const articleBatch = [];

Xray.timeout(500000)('https://www.marketwatch.com/search?q=&m=Keyword&rpp=500&mp=806&bd=false&rs=true', {
  links: Xray('.resultlist .searchresult', [{
    article: Xray('a@href', {
      body: '#article-body@html',
      author: 'meta[name="parsely-author"]@content',
      author_image: '.author-image@src',
      publisher: 'meta[name="article:publisher"]@content',
      section: 'meta[name="parsely-section"]@content',
      tags: 'meta[name="parsely-tags"]@content',
      date_published: 'meta[name="parsely-pub-date"]@content',
      source: 'meta[property="og:url"]@content',
      thumbnail: '.hero-figure img@src',
      title: 'meta[property="og:title"]@content',
      description: 'meta[name="description"]@content',
    }),
  }]),
})((err, pages) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Processing results from MarketWatch...');
  pages.forEach((articles) => {
    articles.links.forEach((articlePage) => {
      // articleBatch.push(db.Article.build(articlePage.article));

      db.Article.create(articlePage.article)
        .then(() => {
          // console.log('Created new Article');
        })
        .catch((err) => {
          // console.log('Article failed validation');
          // console.log(err);
        });
    });
  });

  // db.Article.bulkCreate(articleBatch);

  console.log('Finished processing results from MarketWatch.');
  console.log('Done!');
})
  .limit(6)
  .paginate('.nextprevlinks a:last-of-type@href');

const db = require('../models');
const Xray = require('x-ray')();

Xray.timeout(50000)('https://www.marketwatch.com/search?q=&m=Keyword&rpp=500&mp=807&bd=false&rs=true', {
  links: Xray.timeout(50000)('.resultlist .searchresult', [{
    article: Xray.timeout(50000)('a@href', {
      body: '#article-body@html',
      author: 'meta[name="author"]@content',
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
  console.log('Processing results from MarketWatch...');
  pages.forEach((articles) => {
    articles.links.forEach((articlePage) => {
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
  console.log('Finished processing results from MarketWatch.');
  console.log('Done!');
})
  .limit(5)
  .paginate('.nextprevlinks a:last-of-type@href');

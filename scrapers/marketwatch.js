const db = require('../models');
const Xray = require('x-ray')();

Xray('https://www.marketwatch.com/search?q=&m=Keyword&rpp=500&mp=807&bd=false&rs=true', {
  links: Xray('.resultlist .searchresult', [{
    article: Xray('a@href', {
      body: '#article-body@html',
      author: 'meta[name="author"]@content',
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
})(function (err, pages) {
  console.log('Processing results...');
  pages.forEach((articles) => {
    console.log(articles.links.length);
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
  console.log('Done!');
})
  .limit(5)
  .paginate('.nextprevlinks a:last-of-type@href');

const db = require('../models');
const Xray = require('x-ray')();

function scrape(pages, resultsPerPage) {
  const results = new Promise((resolve, reject) => {
    Xray.timeout(500000)(`https://www.marketwatch.com/search?q=&m=Keyword&rpp=${resultsPerPage}&mp=806&bd=false&rs=true`, {
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
        reject();
        return;
      }
      pages.forEach((articles) => {
        articles.links.forEach((articlePage) => {
          db.Article.create(articlePage.article).catch(() => {});
        });
      });
      console.log('Completed scrap of MarketWatch.com')
      resolve();
    })
      .limit(pages)
      .paginate('.nextprevlinks a:last-of-type@href'); 
  });

  return results;
}

module.exports = scrape;

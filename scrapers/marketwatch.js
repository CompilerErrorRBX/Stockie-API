const nlp = require('compromise');
const Xray = require('x-ray')();

const db = require('../models');

function scrape(pages, resultsPerPage) {
  const results = new Promise((resolve, reject) => {
    Xray.timeout(5000000)(`https://www.marketwatch.com/search?q=&m=Keyword&rpp=${resultsPerPage}&mp=806&bd=false&rs=true`, {
      links: Xray('.resultlist .searchresult', [{
        article: Xray('a@href', {
          body: '#article-body@html',
          processed_body: '#article-body@text',
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
          articlePage.article.processed_body = nlp(articlePage.article.processed_body).out('normal')
          db.Article.create(articlePage.article)
            .then((article) => {
              // console.log(article);
              // const cleanText = nlp(`${articlePage.article.description} ${articlePage.article.title} ${articlePage.article.body_text}`).normalize();
              // console.log(cleanText.topics().out('freq'));
              const tags = articlePage.article.tags.split(',');
              tags.forEach((tag) => {
                db.sequelize.transaction((t) => {
                  return db.Tag.findOrCreate({
                    where: { tag },
                    transaction: t,
                  })
                    .spread((model) => {
                      article.addTag(model);
                    });
                });
              });
            }).catch(() => {});
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

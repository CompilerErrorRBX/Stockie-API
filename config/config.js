module.exports = {
  'development': {
    'username': process.env.STOCKIE_DEVELOPMENT_USERNAME ? process.env.STOCKIE_DEVELOPMENT_USERNAME : 'root',
    'password': process.env.STOCKIE_DEVELOPMENT_PASSWORD ? process.env.STOCKIE_DEVELOPMENT_PASSWORD : null,
    'database': 'Stockie_Dev',
    'host': '127.0.0.1',
    'dialect': 'mysql',
    'logging': false
  },
  'test': {
    'username': 'root',
    'password': null,
    'database': 'Stockie_Test',
    'host': '127.0.0.1',
    'dialect': 'mysql',
    'logging': false
  },
  'production': {
    'username': process.env.STOCKIE_PRODUCTION_USERNAME,
    'password': process.env.STOCKIE_PRODUCTION_PASSWORD,
    'database': 'Stockie_Prod',
    'host': '127.0.0.1',
    'dialect': 'mysql',
    'logging': false
  }
}

const Sequelize = require('sequelize');

const con = new Sequelize('Stockie', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  sync: { force: true },
  logging: false,

  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 50000
  },
});

module.exports = con;

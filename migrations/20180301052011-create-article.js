'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      author: {
        type: Sequelize.STRING(128),
      },
      author_image: {
        type: Sequelize.STRING(128),
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date_published: {
        type: Sequelize.DATE(6),
      },
      description: {
        type: Sequelize.STRING(1024),
      },
      publisher: {
        type: Sequelize.STRING(256),
      },
      processed_body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      section: {
        type: Sequelize.STRING(64),
      },
      source: {
        type: Sequelize.STRING(512),
      },
      thumbnail: {
        type: Sequelize.STRING(512),
      },
      title: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true,
      },
    }).then(() => {
      queryInterface.addIndex('Articles', {
        type: 'FULLTEXT',
        name: 'search',
        fields: ['body', 'description', 'title'],
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Articles');
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
      },
      author: {
        type: Sequelize.STRING(128),
      },
      body: {
        type: Sequelize.TEXT,
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Articles');
  }
};
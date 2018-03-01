'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Article_Tags', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36)
      },
      article_id: {
        type: Sequelize.STRING(36)
      },
      tag_id: {
        type: Sequelize.STRING(36)
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Article_Tags');
  }
};
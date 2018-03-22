'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Article_Tags', {
      ArticleId: {
        type: Sequelize.UUID,
        foreignKey: true,
        references: {
          model: 'Articles',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
        allowNull: false
      },
      TagId: {
        type: Sequelize.UUID,
        foreignKey: true,
        references: {
          model: 'Tags',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
        allowNull: false
      },
      weight: {
        type: Sequelize.DOUBLE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Article_Tags');
  }
};
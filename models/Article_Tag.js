const UUID = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Article_Tag = sequelize.define('Article_Tags', {
    ArticleId: {
      type: DataTypes.UUID,
      references: {
        model: 'Articles',
        key: 'id',
      },
      allowNull: false,
    },
    TagId: {
      type: DataTypes.UUID,
      references: {
        model: 'Tags',
        key: 'id',
      },
      allowNull: false,
    },
    weight: DataTypes.DOUBLE,
  }, {
    timestamps: false,
  });

  return Article_Tag;
};

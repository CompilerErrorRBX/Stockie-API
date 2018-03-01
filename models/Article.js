const UUID = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    author: DataTypes.STRING,
    body: DataTypes.TEXT,
    description: DataTypes.STRING,
    date_published: DataTypes.DATE(6),
    publisher: DataTypes.STRING,
    section: DataTypes.STRING,
    source: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    title: {
      type: DataTypes.STRING,
      unique: true,
    }
  }, {
    timestamps: false,
    hooks: {
      beforeCreate(model, options) {
        model.id = UUID();
      },
    }
  });

  return Article;
};
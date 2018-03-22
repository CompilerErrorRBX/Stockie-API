const UUID = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Articles', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    author: DataTypes.STRING,
    author_image: DataTypes.STRING,
    body: DataTypes.TEXT,
    description: DataTypes.STRING,
    date_published: DataTypes.DATE,
    publisher: DataTypes.STRING,
    processed_body: DataTypes.TEXT,
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

  Article.associate = (models) => {
    // associations can be defined here
    Article.belongsToMany(models.Tag, { through: 'Article_Tags', as: 'Tags' });
  };

  return Article;
};
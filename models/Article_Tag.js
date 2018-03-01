const UUID = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Article_Tag = sequelize.define('Article_Tag', {
    id: {
        type: DataTypes.STRING,
      primaryKey: true,
    },
    article_id: DataTypes.STRING,
    tag_id: DataTypes.STRING
  }, {
    timestamps: false,
    hooks: {
      beforeCreate(model, options) {
        model.id = UUID();
      },
    }
  });
  Article_Tag.associate = (models) => {
    // associations can be defined here
  };

  return Article_Tag;
};

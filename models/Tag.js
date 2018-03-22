const UUID = require('uuid/v4');
const Article_Tag = require('./Article_Tag');

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tags', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    tag: DataTypes.STRING(128)
  }, {
    timestamps: false,
    hooks: {
      beforeCreate(model, options) {
        model.id = UUID();
      },
    }
  });
  Tag.associate = (models) => {
    // associations can be defined here
    Tag.belongsToMany(models.Article, { through: 'Article_Tags', as: 'Articles' });
  };
  
  return Tag;
};
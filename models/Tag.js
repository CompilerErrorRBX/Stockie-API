const UUID = require('uuid/v4');
const Article_Tag = require('./Article_Tag');

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tag: DataTypes.STRING
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
  };
  
  return Tag;
};
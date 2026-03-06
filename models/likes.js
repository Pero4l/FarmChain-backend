'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      likes.belongsTo(models.Users, { foreignKey: 'user_id' });
      likes.belongsTo(models.Posts, { as: 'post', foreignKey: 'post_id' }); // ← add alias
    }

  }
  likes.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    post_id: DataTypes.UUID,
    is_like: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Likes',
    tableName: 'likes',
  });
  return likes;
};
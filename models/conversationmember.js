'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConversationMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ConversationMember.belongsTo(models.Conversation, {
        foreignKey: "conversation_id",
      });

      ConversationMember.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "User"
      });
    }
  }
  ConversationMember.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    conversation_id: DataTypes.UUID,
    user_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'ConversationMember',
    tableName: 'conversation_members',
  });
  return ConversationMember;
};
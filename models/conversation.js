'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Conversation.hasMany(models.ConversationMember, {
        foreignKey: "conversation_id",
        as: "ConversationMembers"
      });

      Conversation.hasMany(models.Message, {
        foreignKey: "conversation_id",
        as: "Messages"
      });
    }
  }
  Conversation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Conversation',
    tableName: 'conversations',
  });
  return Conversation;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Message.belongsTo(models.Conversation, {
    foreignKey: "conversation_id",
  });

  Message.belongsTo(models.Users, {
    foreignKey: "sender_id",
  });
    }
  }
  Message.init({
    conversation_id: DataTypes.UUID,
    sender_id: DataTypes.UUID,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
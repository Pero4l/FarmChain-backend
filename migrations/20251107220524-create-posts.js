'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      farmer: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      },
      verified: {
        type: Sequelize.BOOLEAN
      },
      farmSize: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      images: {
        type: Sequelize.JSON
      },
      video: {
        type: Sequelize.JSON
      },
      likes: {
        type: Sequelize.INTEGER
      },
      comments: {
        type: Sequelize.INTEGER
      },
      shares: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.JSON
      },
      category: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('listing', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      buyPrice: Sequelize.INTEGER,
      price: Sequelize.INTEGER,
      priceMin: Sequelize.INTEGER,
      closingDate: Sequelize.DATE,
      closingDateMaxDays: Sequelize.INTEGER,
      closingDateMinDays: Sequelize.INTEGER,
      active: Sequelize.BOOLEAN,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('listing')
  }
};

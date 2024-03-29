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
      auctionStart: Sequelize.DATE,
      auctionEnd: Sequelize.DATE,
      closingDate: Sequelize.DATE,
      closingDateMax: Sequelize.DATE,
      closingDateMin: Sequelize.DATE,
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

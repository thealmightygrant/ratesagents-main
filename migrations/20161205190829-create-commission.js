'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('commission', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      flatFee: Sequelize.INTEGER,
      //TODO: tiered commissions by default?
      commissionType: Sequelize.ENUM('none', 'traditional', 'tieredTotal', 'tieredMarginal'),
      tier0price: Sequelize.INTEGER,
      tier0Commission: Sequelize.DECIMAL(10,2),
      tier1Price: Sequelize.INTEGER,
      tier1Commission: Sequelize.DECIMAL(10,2),
      tier2Price: Sequelize.INTEGER,
      tier2Commission: Sequelize.DECIMAL(10,2),
      tier3Price: Sequelize.INTEGER,
      tier3Commission: Sequelize.DECIMAL(10,2),
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

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('commission');
  }
};

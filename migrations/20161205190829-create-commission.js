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
      tier0price: Sequelize.INTEGER,  //tier 0 probably price min -> desired price
      tier0Commission: Sequelize.INTEGER,
      tier1Price: Sequelize.INTEGER,  //tier 1 = tier 0 price -> this price
      tier1Commission: Sequelize.INTEGER,
      tier2Price: Sequelize.INTEGER,  //etc
      tier2Commission: Sequelize.INTEGER,
      tier3Price: Sequelize.INTEGER,
      tier3Commission: Sequelize.INTEGER,
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

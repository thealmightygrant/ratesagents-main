'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('home', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      builtIn: Sequelize.INTEGER,     //e.g. 1999
      homeSize: Sequelize.INTEGER,    //e.g. 2000 sq ft
      //NOTE: try to enumerate these ahead of time, rebuild could be expensive in the future
      homeType: Sequelize.ENUM('house', 'condo', 'townhome', 'land'),
      numBedrooms: Sequelize.DECIMAL(10,2),
      numBathrooms: Sequelize.DECIMAL(10,2),
      streetNumber: Sequelize.STRING,
      route: Sequelize.STRING,
      city: Sequelize.STRING,
      neighborhood: Sequelize.STRING,
      county: Sequelize.STRING,
      state: Sequelize.STRING,
      zipcode: Sequelize.STRING,
      secondaryDesignator: Sequelize.STRING,
      secondaryDescriptor: Sequelize.STRING,
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
    return queryInterface.dropTable('home');
  }
};

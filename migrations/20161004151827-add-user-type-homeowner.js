'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'homeowner',
      'userType',
      {
        type: Sequelize.ENUM('homeowner'),
        allowNull: false,
        defaultValue: 'homeowner'
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("ALTER TABLE \"homeowner\" DROP COLUMN \"userType\"; DROP TYPE \"enum_homeowner_userType\";");
  }
};

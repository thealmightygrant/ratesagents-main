'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'realtor',
      'userType',
      {
        type: Sequelize.ENUM('realtor'),
        allowNull: false,
        defaultValue: 'realtor'
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("ALTER TABLE \"realtor\" DROP COLUMN \"userType\"; DROP TYPE \"enum_realtor_userType\";");
  }
};

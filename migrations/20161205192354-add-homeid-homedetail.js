'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"homeDetail\" ADD COLUMN \"homeId\" uuid; ALTER TABLE \"homeDetail\" ADD CONSTRAINT \"homeDetail_homeId_fkey\" FOREIGN KEY (\"homeId\") REFERENCES \"home\" (\"id\") MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL;");
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"homeDetail\" DROP CONSTRAINT \"homeDetail_homeId_fkey\"; ALTER TABLE \"homeDetail\" DROP COLUMN \"homeId\";");
  }
};

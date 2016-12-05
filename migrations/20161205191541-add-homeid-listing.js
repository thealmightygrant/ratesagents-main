'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" ADD COLUMN \"homeId\" uuid; ALTER TABLE \"listing\" ADD CONSTRAINT \"listing_homeId_fkey\" FOREIGN KEY (\"homeId\") REFERENCES \"home\" (\"id\") MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL;");
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" DROP CONSTRAINT \"listing_homeId_fkey\"; ALTER TABLE \"listing\" DROP COLUMN \"homeId\";");
  }
};

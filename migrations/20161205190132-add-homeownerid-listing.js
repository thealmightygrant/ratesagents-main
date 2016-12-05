'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" ADD COLUMN \"homeownerId\" uuid; ALTER TABLE \"listing\" ADD CONSTRAINT \"listing_homeownerId_fkey\" FOREIGN KEY (\"homeownerId\") REFERENCES \"homeowner\" (\"id\") MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL;");
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" DROP CONSTRAINT \"listing_homeownerId_fkey\"; ALTER TABLE \"listing\" DROP COLUMN \"homeownerId\";");
  }
};

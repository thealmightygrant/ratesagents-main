'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" ADD COLUMN \"realtorId\" uuid; ALTER TABLE \"listing\" ADD CONSTRAINT \"listing_realtorId_fkey\" FOREIGN KEY (\"realtorId\") REFERENCES \"realtor\" (\"id\") MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL;");
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" DROP CONSTRAINT \"listing_realtorId_fkey\"; ALTER TABLE \"listing\" DROP COLUMN \"realtorId\";");
  }
};

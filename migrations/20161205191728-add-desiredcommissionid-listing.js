'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" ADD COLUMN \"desiredCommissionId\" uuid; ALTER TABLE \"listing\" ADD CONSTRAINT \"listing_desiredCommissionId_fkey\" FOREIGN KEY (\"desiredCommissionId\") REFERENCES \"commission\" (\"id\") MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL;");
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" DROP CONSTRAINT \"listing_desiredCommissionId_fkey\"; ALTER TABLE \"listing\" DROP COLUMN \"desiredCommissionId\";");
  }
};

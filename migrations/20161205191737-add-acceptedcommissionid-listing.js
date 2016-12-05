'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" ADD COLUMN \"acceptedCommissionId\" uuid; ALTER TABLE \"listing\" ADD CONSTRAINT \"listing_acceptedCommissionId_fkey\" FOREIGN KEY (\"acceptedCommissionId\") REFERENCES \"commission\" (\"id\") MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL;");
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"listing\" DROP CONSTRAINT \"listing_acceptedCommissionId_fkey\"; ALTER TABLE \"listing\" DROP COLUMN \"acceptedCommissionId\";");
  }
};

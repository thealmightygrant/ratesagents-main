'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"realtor\" ADD COLUMN \"facebookAccountId\" uuid; ALTER TABLE \"realtor\" ADD CONSTRAINT \"realtor_facebookAccountId_fkey\" FOREIGN KEY (\"facebookAccountId\") REFERENCES \"facebookAccount\" (\"id\") MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;");
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"realtor\" DROP CONSTRAINT \"realtor_facebookAccountId_fkey\"; ALTER TABLE \"realtor\" DROP COLUMN \"facebookAccountId\";");
  }
};

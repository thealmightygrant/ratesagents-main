'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"homeowner\" ADD COLUMN \"facebookAccountId\" uuid; ALTER TABLE \"homeowner\" ADD CONSTRAINT \"homeowner_facebookAccountId_fkey\" FOREIGN KEY (\"facebookAccountId\") REFERENCES \"facebookAccount\" (\"id\") MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;");
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query("ALTER TABLE \"homeowner\" DROP CONSTRAINT \"homeowner_facebookAccountId_fkey\"; ALTER TABLE \"homeowner\" DROP COLUMN \"facebookAccountId\";");
  }
};

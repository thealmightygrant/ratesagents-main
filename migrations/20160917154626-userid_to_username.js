'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('Realtors', 'userid', 'username')
    queryInterface.renameColumn('Humans', 'userid', 'username')
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('Realtors', 'username', 'userid')
    queryInterface.renameColumn('Humans', 'username', 'userid') 
  }
};

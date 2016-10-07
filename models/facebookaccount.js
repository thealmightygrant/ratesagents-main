'use strict';
module.exports = function(sequelize, DataTypes) {
  var FacebookAccount = sequelize.define('facebookAccount', {
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    profileId: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  return FacebookAccount;
};

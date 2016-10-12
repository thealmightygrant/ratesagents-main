'use strict';
module.exports = function(sequelize, DataTypes) {
  var FacebookAccount = sequelize.define('facebookAccount', {
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    }
  }, {
    freezeTableName: true
  });
  return FacebookAccount;
};

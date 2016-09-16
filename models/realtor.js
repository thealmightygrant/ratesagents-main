'use strict';
module.exports = function(sequelize, DataTypes) {
  var Realtor = sequelize.define('Realtor', {
    name: DataTypes.STRING,
    userid: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Realtor.hasMany(models.Listing);
      }
    }
  });
  return Realtor;
};

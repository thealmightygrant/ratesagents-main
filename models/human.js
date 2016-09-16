'use strict';
module.exports = function(sequelize, DataTypes) {
  var Human = sequelize.define('Human', {
    name: DataTypes.STRING,
    userid: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        //sets up a join table between human and house
        Human.hasMany(models.House);
      }
    }
  });
  return Human;
};

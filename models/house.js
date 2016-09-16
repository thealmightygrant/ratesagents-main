'use strict';
module.exports = function(sequelize, DataTypes) {
  var House = sequelize.define('House', {
    street: DataTypes.STRING,
    housenumber: DataTypes.STRING,
    auxinfo: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        //adds Human index to House
        House.belongsTo(models.Human);
        //sets up a join table between house and listings
        House.hasMany(models.Listing);
      }
    }
  });
  return House;
};

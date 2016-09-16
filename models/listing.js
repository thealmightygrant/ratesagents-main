'use strict';
module.exports = function(sequelize, DataTypes) {
  var Listing = sequelize.define('Listing', {
    startdate: DataTypes.DATE,
    desired_sale_value: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // Adds house index to Listing
        Listing.belongsTo(models.House)
      }
    }
  });
  return Listing;
};

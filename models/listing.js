'use strict';
module.exports = function(sequelize, DataTypes) {
  var Listing = sequelize.define('listing', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    priceMin: DataTypes.INTEGER,
    closingDate: DataTypes.DATE,
    closingDateMaxDays: DataTypes.INTEGER, //number of days past desiredClosingDate that are acceptable
    closingDateMinDays: DataTypes.INTEGER //number of days before desiredClosingDate that sale is acceptable
  }, {
    freezeTableName: true
    , classMethods: {
      associate: function(models) {
        Listing.belongsTo(models.homeowner)
        Listing.belongsTo(models.realtor)
        Listing.belongsTo(models.home);
        Listing.belongsTo(models.commission, {as: 'desiredCommission'})
        Listing.belongsTo(models.commission, {as: 'acceptedCommission'})
        //Listing.belongsTo(models.auction) --> store redis id for bid referencing
      }
    }
  });

  return Listing;
};

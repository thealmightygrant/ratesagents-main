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
    //IDEA: any change in price, just copy all of it
    //      and link to new Listing. requires a flag to show as inactive
    //IDEA: change to some kind of price history?
    buyPrice: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    priceMin: DataTypes.INTEGER,
    auctionStart: DataTypes.DATE,
    auctionEnd: DataTypes.DATE,
    closingDate: DataTypes.DATE,
    //NOTE: number of days past desiredClosingDate that are acceptable
    closingDateMax: DataTypes.DATE,
    //NOTE: number of days before desiredClosingDate that sale is acceptable
    closingDateMin: DataTypes.DATE,
    //TODO: add active / inactive
    active: DataTypes.BOOLEAN
  }, {
    freezeTableName: true
    , classMethods: {
      associate: function(models) {
        Listing.belongsTo(models.homeowner)
        Listing.belongsTo(models.realtor)
        Listing.belongsTo(models.home);
        Listing.belongsTo(models.commission, {as: 'desiredCommission'})
        Listing.belongsTo(models.commission, {as: 'acceptedCommission'})
        //Listing.belongsTo(models.marketing, {as: 'desiredMarketing'})
        //Listing.belongsTo(models.marketing, {as: 'acceptedMarketing'})
        //Listing.belongsTo(models.auction) --> store redis id for bid referencing
      }
    }
  });

  return Listing;
};

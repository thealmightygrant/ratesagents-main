'use strict';
module.exports = function(sequelize, DataTypes) {
  var Commission = sequelize.define('commission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    flatFee: DataTypes.INTEGER,
    //TODO: tiered commissions by default?
    commissionType: DataTypes.ENUM('none', 'traditional', 'tieredTotal', 'tieredMarginal'),
    tier0price: DataTypes.INTEGER,  //tier 0 probably price min -> desired price
    tier0Commission: DataTypes.DECIMAL(10,2),
    tier1Price: DataTypes.INTEGER,  //tier 1 = tier 0 price -> this price
    tier1Commission: DataTypes.DECIMAL(10,2),
    tier2Price: DataTypes.INTEGER,  //etc
    tier2Commission: DataTypes.DECIMAL(10,2),
    tier3Price: DataTypes.INTEGER,
    tier3Commission: DataTypes.DECIMAL(10,2)
  }, {
    freezeTableName: true
  });

  return Commission;
};

'use strict';
module.exports = function(sequelize, DataTypes) {
  var setPercentage = function setPercentage(data_name, string_val){
    var int_val = +string_val * 100;
    this.setDataValue(data_name, int_val);
  }

  var getPercentage = function getPercentage(int_val){
    var string_val = (int_val / 100).toString();
    return string_val;
  }

  var percentageType = function(data_name){
    return {
      type: DataTypes.INTEGER,
      set: setPercentage.bind(null, data_name),
      get: getPercentage
    }
  }

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
    tier0Commission: percentageType('tier0Commission'),
    tier1Price: DataTypes.INTEGER,  //tier 1 = tier 0 price -> this price
    tier1Commission: percentageType('tier1Commission'),
    tier2Price: DataTypes.INTEGER,  //etc
    tier2Commission: percentageType('tier2Commission'),
    tier3Price: DataTypes.INTEGER,
    tier3Commission: percentageType('tier3Commission')
  }, {
    freezeTableName: true
  });

  return Commission;
};

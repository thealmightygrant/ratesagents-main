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
    tier0Commission: {
      type: DataTypes.DECIMAL(10,2),
      set: function(string_val){
        var dec_val = parseFloat(string_val).toFixed(2);
        if(string_val && !isNaN(dec_val)){
          this.setDataValue('tier0Commission', dec_val);
        }
      }
    },
    tier1Price: DataTypes.INTEGER,  //tier 1 = tier 0 price -> this price
    tier1Commission: {
      type: DataTypes.DECIMAL(10,2),
      set: function(string_val){
        var dec_val = parseFloat(string_val).toFixed(2);
        if(string_val && !isNaN(dec_val)){
          this.setDataValue('tier1Commission', dec_val);
        }
      }
    },
    tier2Price: DataTypes.INTEGER,  //etc
    tier2Commission: {
      type: DataTypes.DECIMAL(10,2),
      set: function(string_val){
        var dec_val = parseFloat(string_val).toFixed(2);
        if(string_val && !isNaN(dec_val)){
          this.setDataValue('tier2Commission', dec_val);
        }
      }
    },
    tier3Price: DataTypes.INTEGER,
    tier3Commission: {
      type: DataTypes.DECIMAL(10,2),
      set: function(string_val){
        var dec_val = parseFloat(string_val).toFixed(2);
        if(string_val && !isNaN(dec_val)){
          this.setDataValue('tier3Commission', dec_val);
        }
      },
    }
  }, {
    freezeTableName: true
  });

  return Commission;
};

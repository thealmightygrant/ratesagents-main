'use strict';
module.exports = function(sequelize, DataTypes) {
  var Home = sequelize.define('home', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    builtIn: {
      type: DataTypes.INTEGER,
      set: function(string_val){
        if(string_val && !isNaN(parseInt(string_val,10)))
          this.setDataValue('builtIn', +string_val);
      }
    },     //e.g. 1999
    homeSize: {
      type: DataTypes.INTEGER,
      set: function(string_val){
        if(string_val && !isNaN(parseInt(string_val,10)))
          this.setDataValue('homeSize', +string_val);
      }
    },    //e.g. 2000 sq ft
    homeType: DataTypes.ENUM('house', 'condo', 'townhome', 'land'),
    numBedrooms: {
      type: DataTypes.DECIMAL(10,2),
      set: function(string_val){
        var dec_val = parseFloat(string_val).toFixed(2);
        if(string_val && !isNaN(dec_val)){
          this.setDataValue('numBedrooms', dec_val);
        }
      }
    },
    numBathrooms: {
      type: DataTypes.DECIMAL(10,2),
      set: function(string_val){
        var dec_val = parseFloat(string_val).toFixed(2);
        if(string_val && !isNaN(dec_val)){
          this.setDataValue('numBathrooms', dec_val);
        }
      }
    },
    secondaryDesignator: DataTypes.STRING,
    secondaryDescriptor: DataTypes.STRING,
    streetNumber: DataTypes.STRING,
    route: DataTypes.STRING,
    neighborhood: DataTypes.STRING,
    city: DataTypes.STRING,
    county: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING
  }, {
    freezeTableName: true
    , classMethods: {
      associate: function(models) {
        //NOTE: might be a good idea if we are querying listings of a certain home
        //Home.hasMany(models.listing)
        Home.hasMany(models.homeDetail);
      }
    }
  });

  return Home;
};

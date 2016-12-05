'use strict';
module.exports = function(sequelize, DataTypes) {
  var Home = sequelize.define('home', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    builtIn: DataTypes.INTEGER,     //e.g. 1999
    homeSize: DataTypes.INTEGER,    //e.g. 2000 sq ft
    //NOTE: try to enumerate these ahead of time, rebuild could be expensive in the future
    homeType: DataTypes.ENUM('house', 'condo', 'townhome'),
    numBedrooms: {
      type: DataTypes.INTEGER,
      set: function(string_val){
        var int_val = +string_val * 100;
        this.setDataValue('num_bedrooms', int_val);
      },
      get: function(int_val){
        var string_val = (int_val / 100).toString();
        return string_val;
      }
    },
    numBathrooms: {
      type: DataTypes.INTEGER,
      set: function(string_val){
        var int_val = +string_val * 100;
        this.setDataValue('num_bedrooms', int_val);
      },
      get: function(int_val){
        var string_val = (int_val / 100).toString();
        return string_val;
      }
    },
    streetNumber: DataTypes.STRING,
    route: DataTypes.STRING,
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

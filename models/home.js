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
        this.setDataValue('builtIn', +string_val);
      }
    },     //e.g. 1999
    homeSize: {
      type: DataTypes.INTEGER,
      set: function(string_val){
        this.setDataValue('homeSize', +string_val);
      }
    },    //e.g. 2000 sq ft
    homeType: DataTypes.ENUM('house', 'condo', 'townhome', 'land'),
    numBedrooms: {
      type: DataTypes.INTEGER,
      set: function(string_val){
        var int_val = +string_val * 100;
        this.setDataValue('numBedrooms', int_val);
      },
      get: function(int_val){
        var fixed_val = (int_val / 100).toFixed(2);
        return fixed_val;
      }
    },
    numBathrooms: {
      type: DataTypes.INTEGER,
      set: function(string_val){
        var int_val = +string_val * 100;
        this.setDataValue('numBathrooms', int_val);
      },
      get: function(int_val){
        var fixed_val = (int_val / 100).toFixed(2);
        return fixed_val;
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

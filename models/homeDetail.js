'use strict';
module.exports = function(sequelize, DataTypes) {
  var HomeDetail = sequelize.define('homeDetail', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: DataTypes.STRING,
    size: {
      type: DataTypes.INTEGER,
      set: function(string_val){
        this.setDataValue('size', +string_val);
      },
      get: function(int_val){
        return int_val.toString();
      }
    },
    features: DataTypes.TEXT
  }, {
    freezeTableName: true
    , classMethods: {
      associate: function(models) {
        HomeDetail.belongsTo(models.home);
      }
    }
  });

  return HomeDetail;
};

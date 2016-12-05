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
    size: DataTypes.INTEGER,      //almost always in sq footage
    attributes: DataTypes.STRING  //CSVs
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

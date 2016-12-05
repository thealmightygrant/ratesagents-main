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
    size: DataTypes.INTEGER,
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

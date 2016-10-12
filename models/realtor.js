'use strict';
var bcrypt = require('bcryptjs')

module.exports = function(sequelize, DataTypes) {
  var Realtor = sequelize.define('realtor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      set: function(string_val){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(string_val, salt);
        this.setDataValue('password', hash);
      }
    },
    email: {
      type: DataTypes.STRING,
    },
    userType: {
      type: DataTypes.ENUM('realtor'),
      defaultValue: 'realtor',
      allowNull: false
    }
  }, {
    freezeTableName: true
    , classMethods: {
      associate: function(models) {
        Realtor.belongsTo(models.facebookAccount, {
          //TODO: does this need to be contraints: false?
          onDelete: "CASCADE"
        });
      }
    }

  });

  return Realtor;
};

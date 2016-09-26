'use strict';
var bcrypt = require('bcryptjs')

module.exports = function(sequelize, DataTypes) {
  var Homeowner = sequelize.define('homeowner', {
    name: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function(string_val){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(string_val, salt);
        this.setDataValue('password', hash);
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });
  return Homeowner;
};

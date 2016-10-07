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
      set: function(string_val){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(string_val, salt);
        this.setDataValue('password', hash);
      }
    },
    email: {
      //TODO: this seems like a security issue with nonlocal logins
      type: DataTypes.STRING,
    },
    userType: {
      type: DataTypes.ENUM('homeowner'),
      defaultValue: 'homeowner',
      allowNull: false
    }
  }, {
    freezeTableName: true
    , classMethods: {
      associate: function(models) {
        Homeowner.belongsTo(models.facebookAccount, {
         //TODO: does this need to be constraints false?
          onDelete: "CASCADE"
        });
      }
    }
  });

  return Homeowner;
};

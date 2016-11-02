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
      //NOTE: the goal is for this to be unique-ish
      //it can be null, it doesn't have to be set
      //NEVER have logins use this, only unique
      //to facilate user to user identification
      //within the Rates and Agents community
     type: DataTypes.STRING,
    },
    password: {
      //NOTE: can be null when logging in via external service
      type: DataTypes.STRING,
      set: function(string_val){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(string_val, salt);
        this.setDataValue('password', hash);
      }
    },
    email: {
      //NOTE: similar to username
      //this should be unique, don't allow changes
      //without checking for uniqueness
      //this value IS used for logins
      //==> it can be null due to FB and other logins
      //in this instance
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

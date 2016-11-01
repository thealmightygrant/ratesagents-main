'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);

var conf      = require('../config.js')
var seq_config = conf.get('sequelize')
var db        = {};

if (seq_config.use_env_variable) {
  var sequelize = new Sequelize(process.env[seq_config.use_env_variable]);
} else {
  var sequelize = new Sequelize(seq_config.database, seq_config.username, seq_config.password, seq_config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

var conf = require('../config.js');

var seq_config = {}
seq_config[conf.get('env')] = conf.get('sequelize');

module.exports = seq_config;

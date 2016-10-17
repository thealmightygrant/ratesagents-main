var HBars = require('handlebars');

exports.getDateNumeral = function getDateNumeral(){
  return '' + new Date().getTime();
}

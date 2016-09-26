var Promise = require("bluebird")
,   models = require('../models/index')


function isValueInUse(field_name, value, model_name) {
  return new Promise(function(resolve, reject) {
    var field_object = {where: {}}
    field_object["where"][field_name] = value;
    models[model_name].findOne(field_object).then(function(item){
      console.log("item: ", item);
      if (item) {
        reject(item);
      }
      else {
        resolve(item);
      }
    }).catch(function(error){
      //TODO: distinguish between database failures and used vals
      if (error) {
        reject(error);
      }
    });
  });
}

exports.isUsernameAvailable = function(username, model_name) {
  return isValueInUse("username", username, model_name);
}

exports.isEmailAvailable = function(email, model_name) {
  return isValueInUse("email", email, model_name);
}

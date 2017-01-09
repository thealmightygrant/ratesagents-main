var Promise = require("bluebird")
,   models = require('../models/index')


module.exports = {
  isUsernameAvailable: isUsernameAvailable,
  isEmailAvailable: isEmailAvailable,
  isInternalEmail: isInternalEmail,
  isValidAddress: isValidAddress
}

function isValueInUse(field_name, value, model_name) {
  return new Promise(function(resolve, reject) {
    var field_object = {where: {}}
    field_object["where"][field_name] = value;
    models[model_name].findOne(field_object).then(function(item){
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

function isUsernameAvailable(username, model_name) {
  return isValueInUse("username", username, model_name);
}

function isEmailAvailable(email, model_name) {
  return isValueInUse("email", email, model_name);
}

function isInternalEmail(email) {
  //later on we can make this email.indexOf("ratesandagents.com") !== -1
  return (email === "grant@ratesandagents.com") ||
          (email === "casey@ratesandagents.com")
}

function isValidAddress(home) {
  if(home.streetNumber &&
     home.route &&
     home.city &&
     home.state &&
     home.zipcode)
    return true
  else
    return false
}

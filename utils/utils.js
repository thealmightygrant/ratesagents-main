exports.rexists = function(an_object, attributes){
  var exists = true;
  //TODO: does this deep copy?
  var cur_obj = Object(an_object);  
  if(Array.isArray(attributes)){
    exists = attributes.every(function (att){
      if(att && typeof(att) === "string"){
        exists = att && exists;
        cur_obj = cur_obj[att];
        return true;
      }
      else {
        return false;
      }
    });
  }
  else {
    //TODO: add proper exception handling to this
    return false;
  }
}

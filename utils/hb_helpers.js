var HBars = require('handlebars');

exports.facebook_sdk = function facebook_sdk(options){
  return new HBars.SafeString('<script>' + 
                              'window.fbAsyncInit = function() { ' +
                              '  FB.init({ ' + 
                              'appId      : \'700329213454300\',' + 
                              'xfbml      : true,' + 
                                  'version    : \'v2.7\'' + 
                              '});' + 
                              '};' +
                              '(function(d, s, id){' + 
                              'var js, fjs = d.getElementsByTagName(s)[0];' + 
                              'if (d.getElementById(id)) {return;}' + 
                              'js = d.createElement(s); js.id = id;' + 
                              'js.src = "//connect.facebook.net/en_US/sdk.js";' + 
                              'fjs.parentNode.insertBefore(js, fjs);' + 
                              '}(document, \'script\', \'facebook-jssdk\'));' + 
                              '</script>')
}

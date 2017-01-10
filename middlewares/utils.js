var passport = require('passport')
var cloneDeep = require('lodash.clonedeep');

exports.logErrors = function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

exports.clientErrorHandler = function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

exports.errorHandler = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error500', { error: err });
}

exports.addMessages = function addMessages(req, res, next){
  res.locals.messages = cloneDeep(req.session.messages) || {};
  res.locals.error = cloneDeep(req.session.error) || {};
  //TODO: This might be a security issue copying the whole session
  res.locals.data = cloneDeep(req.session.data) || {}

  // Remove them so they're not displayed on subsequent renders.
  delete req.session.error;
  delete req.session.messages;

  if(!req.session.data)
    req.session.data = {}

  next();
}

function authCallbackFactory(strategy, req, res, next, failureRedirect, successRedirect){
  switch(strategy){
  case 'homeowner-local-login':
  case 'homeowner-local-register':
  case 'realtor-local-login':
  case 'realtor-local-register':
    return localAuthCallbackFactory(req, res, next, failureRedirect, successRedirect);
  default:
    console.error('unknown authorization method');
    return res.redirect(failureRedirect);
  }
}

function localAuthCallbackFactory(req, res, next, failureRedirect, successRedirect){
  //NOTE: the original use of this was to add some data to the redirected url
  return function localAuthCallback(err, user, info, status) {
    if (err) {
      req.session.error = err;
      return next(err)
    }

    if (!user) {
      req.session.messages = info.messages;
      req.session.data = info.data;
      return res.redirect(failureRedirect);
    }
    req.logIn(user, function(err) {
      if (err) {
        req.session.error = err;
        return next(err);
      }
      return res.redirect(successRedirect);
    });
  }
}

//TODO: this is kind of messy, refactor to have fewer inputs
exports.authMiddlewareFactory = function authMiddlewareFactory(strategy, failureRedirect, successRedirect){
  return function passportAuthMiddleware(req, res, next){
    passport.authenticate(strategy, authCallbackFactory(strategy, req, res, next, failureRedirect, successRedirect))(req, res, next);
  };
}

var passport = require('passport')

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
  res.locals.messages = req.session.messages || {};
  res.locals.error = req.session.error || {};
  res.locals.data = req.session.data || {}

  // Remove them so they're not displayed on subsequent renders.
  delete req.session.error;
  delete req.session.messages;
  delete req.session.data;

  next();
}

function authCallbackFactory(strategy, req, res, next, failureRedirect, successRedirect){
  if((strategy === 'homeowner-local-login') ||
     (strategy === 'realtor-local-login')) {
    return localAuthCallbackFactory(req, res, next, failureRedirect, successRedirect);
  }
  //TODO: throw an error?
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
exports.authMiddlewareFactory = function authMiddlewareFactory(strategy, failureRedirect, successRedirect){
  return function passportAuthMiddleware(req, res, next){
    passport.authenticate(strategy, authCallbackFactory(strategy, req, res, next, failureRedirect, successRedirect))(req, res, next);
  };
}



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

exports.flashMsgs = function flashMsgs(req, res, next){
  res.locals.messages = req.flash('messages');
  next();
}

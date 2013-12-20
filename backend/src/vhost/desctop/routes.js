/*
 *  Module routes
 *
 *  Each route is associated with the http request
 *
 *  Total version
 *
 * */

module.exports = function(app){

  var user = require('./../../controllers/user');
  var index = require('./../../controllers/index');
  var settings = require('./../../controllers/settings');
  var registration = require('./../../controllers/registration');
  var registration_result = require('./../../controllers/registration_result');
  var registration_continue = require('./../../controllers/registration_continue');
  /*
  app.all('*', function(req, res, next){
    if(!req.headers.host) {
      res.writeHead(404);
      res.end();
    } else
    if (res.locals.isDesktop){
      next();
    } else
    if (res.locals.isMobile) {
      res.redirect('http://mobile.'+req.headers.host);
    }
  });
  */
  app.get('/', index.desctop);
  app.get('/index', index.desctop);
  app.get('/feonit/settings', settings.desctop);
  app.get('/registration', registration.desctop);
  app.post('/registration', registration.desctop);
  app.post('/registration_result', registration_result.desctop);
  app.get('/registration_continue', registration_continue.desctop);
  app.get('/:name?', user.desctop);

  app.get('/mobile/feonit', require('./../../controllers/user').mobile);
}



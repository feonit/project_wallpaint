/*
 *  Module routes
 *
 *  Each route is associated with the http request
 *
 * */

module.exports = function(app){

  var user = require('./controllers/user');
  var index = require('./controllers/index');
  var settings = require('./controllers/settings');
  var registration = require('./controllers/registration');
  var registration_result = require('./controllers/registration_result');
  var registration_continue = require('./controllers/registration_continue');


  app.get('/', index);
  app.get('/index', index);
  app.get('/feonit/settings', settings);
  app.get('/registration', registration);
  app.post('/registration', registration);
  app.post('/registration_result', registration_result);
  app.get('/registration_continue', registration_continue);
  app.get('/:name?', user);

}



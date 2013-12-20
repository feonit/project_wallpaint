/*
 *  Module routes
 *
 *  Each route is associated with the http request
 *
 *  Mobile version
 *
 * */

module.exports = function(app){

  var index = require('./../../controllers/index');
  var registration = require('./../../controllers/registration');

  app.all('/', index.mobile);
  app.all('/registration', registration.mobile);

}



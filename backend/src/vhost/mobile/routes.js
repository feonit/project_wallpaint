/*
 *  Module routes
 *
 *  Each route is associated with the http request
 *
 *  Mobile version
 *
 * */

module.exports = function(app){

  var index = require('./../../controllers/index_mobile');
  var registration = require('./../../controllers/registration_mobile');

  app.all('/', index);
  app.all('/registration', registration);

}



/*
 *
 *  Controller for the registration_continue route
 *
 * */

var main = require('../main');

module.exports = function(req, res) {

  var db = main.db;

  var host = req.host
    , query = req.query;
  if (query['user'] && query['email'] && query['hash']) {
    db.getConfirm(query['hash'], function (data) {
      data = data[0];
      if (data){
        var user = data['user']
          , email = data['email']
          , hash = data['hash'];
        if (query['user'] === user && query['email'] === email && query['hash'] === hash) {
          db.createNewUser(data);
          db.createTableForUser(user);
          res.redirect('/'+user);
          res.end();
        }
      } else {
        res.end("bad hash"); //todo систему ошибок
      }
    });
  }
};
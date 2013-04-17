var db = require('./db')
  , fs = require('fs');

  function getModules(){
    return {
      header : fs.readFileSync("./views/modules/header.html"),
      footer : fs.readFileSync("./views/modules/footer.html")
    };
  }
  exports.index = function(req, res){
    var view = 'index';
    var data = {
      modules:getModules()
    };
    res.render(view, data);
  };
  exports.settings = function(req, res) {
    var view = 'settings';
    var data = {
      modules : getModules()
    };
    res.render(view, data);
  };
  exports.registration = function(req, res) {
    var view = 'registration';
    var data = {
      modules:getModules()
    };
    res.render(view, data);
  };
  exports.user = function(req, res) {
    var view = 'user';
    var data = {
      modules : getModules()
    };
    var name = req.params.name;
    db.getDataUser(name, "user", function (dataUser) {
      if (dataUser[0]) {
        data.dataUser = dataUser[0];
        res.render(view, data);
      }
      else {
        res.end("File or user " + name + " wasn't found");
      }
    });
  };
  exports.registration_continue = function(req, res) {
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
            db.createNewUser(query);
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
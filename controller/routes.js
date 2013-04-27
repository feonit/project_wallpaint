var db = require('./db')
  , fs = require('fs')
  , regular = require('./regular').regExp
  , eventapp = require('./eventapp')
  , mail = require('./mail');

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
  exports.registration_result = function(req, res) {
      var data = req.body;
          var user = data['user']
              , email = data['email']
              , name = data['name']
              , password = data['password']
              , host = data['host']
              , err = undefined;

          function answer(answer){
              var view = 'registration_result';
              var data = {
                  modules:getModules(),
                  answer:answer
              };
              res.render(view, data);
          }

          if (user && email && name && password){
              if (regular.user.test(user)){
                  if (regular.email.test(email)){
                      //db.getDataUser(user, 'user',function(res){
                      //if (!res[0]){
                      //db.getDataUser(email, 'email',function(res){
                      //if (!res[0]){
                      var time = new Date().getTime();
                      var hash = eventapp.getHash(user + email + time);
                      var mailOptions = mail.createMassageRegistration(host, email, user, hash);
                      var confirm = {
                          hash:hash,
                          name:name,
                          password:password,
                          email:email,
                          user:user
                      };
                      db.addConfirm(confirm);
                      mail.sendMassage(mailOptions);
                      answer('Вам на почту было отправлено писмо с инструкцией для завершения регистрации');
                      //}else err = "Такой емаил уже был зарегистрирован";
                      //});
                      //}else err = "Пользователь с таким именем уже есть";
                      //});
                  } else answer("Емаил не корректен");
              } else answer("Имя не корректно");
          } else answer("Потеря данных");
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
        data.dataUser.canvasImage = dataToImage(data.dataUser);
        res.render(view, data);
      }
      else {
        res.end("File or user " + name + " wasn't found");
      }
    });
    function dataToImage(data){

      var App = require('./scripts').App;

      var canvas = App.canvas = App.storeCanvas.newCanvasCtx("default");
      var ctx = App.ctx = App.canvas.ctx;
      App.store.getData(data);
      App.store.drawStore();

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 100;
      ctx.beginPath();
      ctx.lineTo(50, 50);
      ctx.lineTo(2000, 2000);
      ctx.stroke();
      var roughSizeOfObject = require('./regular').roughSizeOfObject;
      console.log(roughSizeOfObject(canvas.toDataURL()));
      return canvas.toDataURL();
    }
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
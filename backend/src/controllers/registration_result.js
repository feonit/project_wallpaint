/*
 *
 *  Controller for the registration_result route
 *
 * */

var main = require('../main');

var mail = main.mail;

var eventapp = main.eventApp;
var db = main.db;
var regular = main.regular;

exports.mobile = null;

exports.desctop = function(req, res) {

  var data = req.body;       //todo no have data why
  var user = data['user']
    , email = data['email']
    , name = data['name']
    , password = data['password']
    , host = data['host']
    , err=undefined;

  function answer(answer){
    var view = 'registration_result';
    var data = {
      answer:answer
    };
    res.render(view, data);
  }

  if (user && email && name && password){
    if (regular.regExp.user.test(user)){
      if (regular.regExp.email.test(email)){
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

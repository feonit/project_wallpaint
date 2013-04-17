(function(){
  var db = require('./db');
  var regExp = require('./regular');
  var eventApp = require('./eventapp');
  var socket = require('socket.io');

  exports.init = function(server){
    var io = exports.io = socket.listen(server);
    io.sockets.on('connection', function (socket) {
      socket.on('drawClick', function (data) {
        eventApp.addDrawTodb(socket, data);
        eventApp.emitDraw(socket, data);
      });
      socket.on('uploadDraw', function (data) {
        eventApp.uploadDraw(socket, data.nameFromPath);
      });
      socket.on('clearAllCanvas', function () {
        eventApp.clearAllCanvas(socket);
      });
      socket.on('searchUser', function (data) {
        var user = data['user'];
        db.getDataUser(user, "user", function (res){
          var answer = (res[0]) ? true : false;
          socket.emit("searchUserAnswer", {answer:answer});
        })
      });
      socket.on('searchEmail', function (data) {
        var user = data['email'];
        db.getDataUser(user, "email", function (res){
          var answer = (res[0]) ? true : false;
          socket.emit("searchEmailAnswer", {answer:answer});
        })
      });
      socket.on('addUser', function (data) {
        var user = data['user']
          , email = data['email']
          , host = data['host']
          , err = undefined;

        if (user && email){
          if (regExp.isValidName(user)){
            if (regExp.isValidEmail(email)){
              //db.getDataUser(user, 'user',function(res){
              //if (!res[0]){
              //db.getDataUser(email, 'email',function(res){
              //if (!res[0]){
              var time = new Date().getTime();
              var hash = eventApp.getHash(user + email + time);
              var mailOptions = mail.createMassageRegistration(host, email, user, hash);
              var confirm = {
                hash:hash,
                user:user,
                email:email
              };
              db.addConfirm(confirm);
              mail.sendMassage(mailOptions);
              err = 0;
              //}else err = 5;
              //});
              //}else err = 4;
              //});
            } else err = 3;
          } else err = 2;
        } else err = 1;
        socket.emit("responseForAddUser", err)
      });
    });
  }
})();
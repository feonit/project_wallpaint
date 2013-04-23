(function(){
  var db = require('./db');
  var regExp = require('./regular');
  var eventApp = require('./eventapp');
  var socket = require('socket.io');

  exports.init = function(server){
    var io = exports.io = socket.listen(server);
      io.configure(function () {
          io.set("transports", ["xhr-polling"]);
          io.set("polling duration", 10);
      });
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
    });
  }
})();
module.exports = (function () {

  var main = require('../main');

  var eventApp = main.eventApp;
  var db = main.db;
  var io = main.io;

  console.log('ioioioioio')

  io.sockets.on('connection', function (socket) {
    console.log('connection')

    socket.on('drawClick', function (data) {
      console.log('drawClick')

      eventApp.addDrawTodb(socket, data);
      eventApp.emitDraw(socket, data);
    });
    socket.on('uploadDraw', function (data) {
      eventApp.uploadDraw(socket, data.nameFromPath);
    });
    socket.on('clearAllCanvas', function () {
      console.log('clearAllCanvas')
      eventApp.clearAllCanvas(socket);
    });
    socket.on('searchUser', function (data) {
      var user = data['user'];
      db.getDataUser(user, "user", function (res) {
        var answer = (res[0]) ? true : false;
        socket.emit("searchUserAnswer", {answer: answer});
      })
    });
    socket.on('searchEmail', function (data) {
      var user = data['email'];
      db.getDataUser(user, "email", function (res) {
        var answer = (res[0]) ? true : false;
        socket.emit("searchEmailAnswer", {answer: answer});
      })
    });
  });
})();
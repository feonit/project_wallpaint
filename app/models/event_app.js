/*
 *
 *  Module event_app
 *
 *  Module is responsible for the events occur when working with a client
 *
 * */

var main = require('../main');

var crypto = main.crypto;
var db = main.db;
var io = main.io;


exports.emitDraw = function (socket, data) {
  socket.get('pageName', function (err, pageName) {
    socket.broadcast.to(pageName).emit('draw', data
    );
  });
};

exports.uploadDraw = function (socket, nameFromPath) {
  db.getTableData(nameFromPath, function (res) {
    if (res) {
      socket.set('pageName', nameFromPath, function () {
      });  //SET pageName for socket
      socket.join(nameFromPath);
      //socket.emit('uploadStore', res);
    }
  });
};

exports.clearAllCanvas = function (socket) {
  socket.get('pageName', function (err, pageName) {
    error(err);
    db.clearTableForUser(pageName);
    io.sockets.emit('clearAllCanvas', pageName);
  });
};

exports.addDrawTodb = function (socket, data) {
  socket.get('pageName', function (err, pageName) {
    var post = {
      x:data['x'], y:data['y'], size:data['size'], r:data['r'], g:data['g'], b:data['b'], opacity:data['opacity'], login:data['login']
    };
    db.addDrawToTable(pageName, post);
  });
};

exports.getHash = function (data) {
  var hash = crypto.createHash('sha1');
  hash.update(data);
  return hash['digest']('hex');
};


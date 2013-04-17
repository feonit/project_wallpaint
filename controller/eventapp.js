var db = require('./db')

exports.emitDraw = function (socket, data) {
    socket.get('pageName', function (err, pageName) {
      socket.broadcast.to(pageName).emit('draw', data
        //io.sockets.in(pageName).emit('draw', {
      );
    });
};

exports.uploadDraw = function (socket, nameFromPath) { //TRUNCATE TABLE test.draw
  //echo('uploadDraw from ' + nameFromPath);
  db.getTableData(nameFromPath, function (res) {
    if (res) {
      socket.set('pageName', nameFromPath, function () {
      });  //SET pageName for socket
      socket.join(nameFromPath);
      socket.emit('uploadStore', res);
    }
  });
};

exports.clearAllCanvas = function (socket) {
  socket.get('pageName', function (err, pageName) {
    db.clearTableForUser(pageName);
    var io = require('./socket').io;
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
  var crypto = require('crypto');
  var hash = crypto.createHash('sha1');
  hash.update(data);
  return hash['digest']('hex');
};


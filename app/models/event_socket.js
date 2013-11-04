module.exports = (function () {

var main = require('../main');

var db = main.db;
var io = main.io;

db.createNewUser({
  user:'feonit', name:'admin', surname:'general', password:'admin', email:'root@emailserver.ru', background:'background.png', face:'root.jpg'
});
db.createTableForUser('feonit');

io.sockets.on('connection', function (socket) {
  console.log('connection')

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('setPageName', function (pageName) {
    this.join(pageName);
    this.set('pageName', pageName, function () {
      //SET pageName for socket
    });
  });

  socket.on('drawClick', function (data) {
    var self = this;
    self.get('pageName', function (err, pageName) {
      self.broadcast.to(pageName).emit('draw', data); //emitDraw

      var post = {
        x:data['x'], y:data['y'], size:data['size'], r:data['r'], g:data['g'], b:data['b'], opacity:data['opacity'], login:data['login']
      };
      db.addDrawToTable(pageName, post);
    });
  });

  socket.on('clearAllCanvas', function () {
    this.get('pageName', function (err, pageName) {
      if (err) throw new Error(err);
      db.clearTableForUser(pageName);
      io.sockets.emit('clearAllCanvas', pageName);
    });
  });

  socket.on('searchUser', function (data) {
    var self = this;
    var user = data['user'];
    db.getDataUser(user, "user", function (res) {
      var answer = !!res[0];
      var enumPage = {
        'registration':1
        ,'registration_rezult':2
        ,'settings':3
        ,'index':4
        , 'user':5
        , 'login':6
      }
      answer = answer || !!enumPage[user];
      self.emit("searchUserAnswer", {answer: answer});
    })
  });

  socket.on('searchEmail', function (data) {
    var self = this;
    var email = data['email'];
    db.getDataUser(email, "email", function (res) {
      var answer = !!res[0]
      self.emit("searchEmailAnswer", {answer: answer});
    })
  });

  socket.on('uploadDraw', function (data) {
    var self = this;
    var pageName = data.nameFromPath;
    db.getTableData(pageName, function (res) {
      if (res) {
        self.set('pageName', pageName, function () {
          self.join(pageName);
        });  //SET pageName for socket
        //socket.emit('uploadStore', res);
      }
    });
  });

});

})();
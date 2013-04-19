(function () {

  require('./controller/console');
  var db = require('./controller/db');

  var express = require('express')
    , http = require('http')
    , app = express()
    , server = http.createServer(app)
    , routes = require('./controller/routes')
    , socket = require('./controller/socket')
    , ejs = require('ejs');

  socket.init(server);
  server.listen(8080);

  app.configure('development',function(){
  ejs.open = '{{';
  ejs.close = '}}';
  app.engine('.html', ejs.__express);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use('/public', express.static(__dirname + '/public'));
  app.set('view options', { layout: true });
});

  app.get('/', routes.index);
  app.get('/index', routes.index);
  app.get('/feonit/settings', routes.settings);
  app.get('/registration', routes.registration);
  app.get('/registration_continue', routes.registration_continue);
  app.get('/:name?', routes.user);

  db.createNewUser({
    user:'feonit', name:'Леонид', surname:'Орлов', password:'232323', email:'feonitu@yandex.ru', background:'background.png', face:'face.jpg'
  });
  db.createTableForUser('feonit');

})();

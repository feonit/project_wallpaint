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


  app.configure('development',function(){
  app.use(express.bodyParser());
  ejs.open = '{{';
  ejs.close = '}}';
  app.set('port', process.env.PORT || 3000);
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
  app.post('/registration', routes.registration);
  app.post('/registration_result', routes.registration_result);
  app.get('/registration_continue', routes.registration_continue);
  app.get('/:name?', routes.user);



    server.listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
    socket.init(server);

  db.createNewUser({
    user:'feonit', name:'Леонид', surname:'Орлов', password:'232323', email:'feonitu@yandex.ru', background:'background.png', face:'feonit.jpg'
  });
  db.createTableForUser('feonit');

})();

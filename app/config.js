module.exports = function(app){

  const port = 80;

  var main = require('./main');

  var express = main.express;
  var ejs = main.ejs;
  var fs = main.fs;

  app.configure('development',function(){
    app.use(express.bodyParser());
    ejs.open = '{{';
    ejs.close = '}}';
    app.set('port', process.env.PORT || port);
    app.engine('.html', ejs.__express);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use('/public', express.static(__dirname + '../../public'));
    app.locals({
      modules : {
        header : fs.readFileSync(__dirname + "/views/parts/header.html"),
        footer : fs.readFileSync(__dirname + "/views/parts/footer.html")
      }
    });
  });

}




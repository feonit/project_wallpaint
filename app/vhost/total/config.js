module.exports = function(app){

  var main = require('./../../main');

  var express = main.express;
  var ejs = main.ejs;
  var fs = main.fs;

  app.configure('development',function(){
    app.use(express.bodyParser());
    ejs.open = '{{';
    ejs.close = '}}';
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
    app.set('views', __dirname + './../../views');
    app.use('/public', express.static(__dirname + './../../../public'));
    app.use(app.router);
    app.locals({
      modules : {
        header : fs.readFileSync(__dirname + "/../../views/parts/footer.html"),
        footer : fs.readFileSync(__dirname + "/../../views/parts/header.html")
      }
    });
  });

}




module.exports = function(app){

  var main = require('./../main');

  var express = main.express;
  var ejs = main.ejs;
  //var fs = main.fs;

  app.configure('development',function(){
    app.use(rememberDeviceInRequest);
    app.use(express.bodyParser());
    ejs.open = '{{';
    ejs.close = '}}';
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
    app.set('views', __dirname + './../views');
    app.use('/public', express.static(__dirname + './../../public'));
    app.use(app.router);
    app.locals({
      modules : {
      //  header : fs.readFileSync(__dirname + "/../views/parts/header.html"),
      //  footer : fs.readFileSync(__dirname + "/../views/parts/footer.html")
      }
    });
  });

}


function rememberDeviceInRequest(req, res, next) {
  var Android, Mobile, iPhone, ua;
  try{
    ua      = req.get('User-Agent');
    iPhone  = ua.match(/iPhone/i) || ua.match(/iPod/i);
    Android = ua.match(/Android/i);
    Mobile  = ua.match(/Mobile/i);
    res.locals.isMobile = (iPhone || (Android && Mobile));
    res.locals.isDesktop = !res.locals.isMobile;
  }catch(err){
    res.locals.isMobile  = false;
    res.locals.isDesktop = false;
  }
  return next();
};





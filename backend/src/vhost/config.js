module.exports = function (app) {
	var main, express, ejs, that;

	var APP_MODE = 'development';
	//var APP_MODE = 'prodaction';

	express = require('express');
	ejs = require('ejs');

	that = this;

	this.rememberDeviceInRequest = function (req, res, next) {
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

	this.devMode = function(){
		app.use(that.rememberDeviceInRequest);
		app.use(express.bodyParser());
		ejs.open = '{{';
		ejs.close = '}}';
		app.engine('.html', ejs.__express);
		app.set('view engine', 'html');
		app.set('views', __dirname + './../views');
		app.use('/public', express.static(__dirname + './../../../frontend/src/public'));
		app.use(app.router);
		app.locals({});
	};

	this.proMode = function(){
		app.use(that.rememberDeviceInRequest);
		app.use(express.bodyParser());
		ejs.open = '{{';
		ejs.close = '}}';
		app.engine('.html', ejs.__express);
		app.set('view engine', 'html');
		app.set('views', __dirname + './../views');
		app.use('/public', express.static(__dirname + './../../../frontend/web/public'));
		app.use(app.router);
		app.locals({});
	};

	app.configure(APP_MODE, this.devMode);

};





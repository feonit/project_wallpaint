// Depends = express;

exports.build = function () {
	var express, app;

	express = WALL.loader.express;

	app = express()
		.use(express.vhost('m.*',require('./vhost/mobile/server_mobile')))
		.use(express.vhost('*', require('./vhost/desctop/server_desctop')));

	if (app) console.log('application is build');

	return app;
}
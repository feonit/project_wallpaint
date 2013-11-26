/**
 * Create http server for my app
 *
 * */


exports.run = function (app) {

	var server, config, fn;

	/**
	 * Configurations
	 *
	 * */

	config = {
		port : 3000,
		startMessage : 'Express server listening on port '
	};

	fn = function () {
		console.log(server.startMessage + server.port);
	};

	server = app.listen(config.port, fn);

	if (server) console.log('http-server is run');

	return server;
};

/**
 * Create http server for my app
 *
 * */


exports.run = function (app) {

	var server, port;

	port =  process.env.PORT || 3000;

	server = app.listen(port, function () {
		console.log('Express server listening on port ' + server.port);
	});

	if (server) {
		console.log('http-server is run');
	}

	return server;
};


/**
 * Namespace app
 *
 * */
WALL = {};

/**
 * Configurations
 *
 * */

WALL.PORT = 3000;

/**
 * Loader packages
 *
 * */

WALL.loader = require('./loader');

WALL.application =  WALL.loader.express()
	.use(WALL.loader.express.vhost('m.*',require('./vhost/mobile/server_mobile')))
	.use(WALL.loader.express.vhost('*', require('./vhost/desctop/server_desctop')));


var server = WALL.application.listen(WALL.PORT, function(){console.log('Express server listening on port ' + WALL.PORT);});




/*var io = WALL.loader.socket_io.listen(server);

io.sockets.on('connection', function (socket) {
	var fn = WALL.loader.eventSocket;

	for (var event in fn) {
		socket.on(event, fn[event])
	}

});*/




var wss = new WALL.loader.ws.Server({server: server});

console.log('websocket server created');

var wsConnections = [],
	i = 1;

wss.on('connection', function(ws) {

	ws.clientNumberConnection = i + 1;
	wsConnections.push(ws);

	var fn = WALL.loader.eventSocket;


	var id = setInterval(function() {
		ws.send(JSON.stringify(new Date()), function() {  });
	}, 1000);

	ws.on('open', function() {
		console.log('websocket connection open');
	});
	ws.on('message', function(event) {
		console.log('websocket connection message');

		if (fn[event.data.type]) {
			fn[event.data.type](event.data);
		}

	});
	ws.on('error', function() {
		console.log('websocket connection error');
	});
	ws.on('close', function() {
		console.log('websocket connection close');
		clearInterval(id);
	});
});





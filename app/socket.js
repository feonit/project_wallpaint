/**
 *
 * Add ws
 *
 * */

// Depends = eventSocket , ws;

exports.run = function (server) {

	var webSocketServer,
		wsConnections = [],
		i = 1;

	/**
	 *
	* Module ws
	*
	* */

 	webSocketServer = new WALL.loader.ws.Server({server: server});



	webSocketServer.on('connection', function(clientSocket) {
		var handlersEvent = WALL.loader.eventSocket;

		clientSocket.numberConnect = i + 1;
		wsConnections.push(clientSocket);


		clientSocket
			.on('open', function() {console.log('websocket connection open');})
			.on('message', function(event) {console.log('websocket connection message')

				if (event.data.type && handlersEvent[event.data.type]) {
					handlersEvent[event.data.type](event.data);
				}

			})
			.on('error', function() {console.log('websocket connection error');})
			.on('close', function() {console.log('websocket connection close');});
	});
	//ошибка основного сервера
	webSocketServer.on('error', function(){})
	//заголовки
	webSocketServer.on('headers', function(){})


	/**
	 * Module Socket.io
	 *
	 * */

	/*var io = WALL.loader.socket_io.listen(server);

	 io.sockets.on('connection', function (socket) {
	 var fn = WALL.loader.eventSocket;

	 for (var event in fn) {
	 socket.on(event, fn[event])
	 }

	 });*/
	if (webSocketServer) console.log('websocket server created');
	return webSocketServer;
};
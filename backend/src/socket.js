/**
 *
 * Add ws
 *
 * */

// Depends = eventSocket , ws;

exports.run = function(server){
	new function () {

		var webSocketServer,
			connects = {},

			handlersEvent = WALL.loader.eventSocket,
			data,
			protocol,
			parse = JSON.parse,
			stringify = JSON.stringify;


		webSocketServer = new WALL.loader.ws.Server({server: server});

		webSocketServer
			.on('connection', function(ws) {
				console.log('websocket connection open');

				// это подпротокол, указывающий на причастность к определённой странице
				protocol = ws.protocol;

				// запоминаем сокет клиента локально, по словарю назначений
				connects[protocol] = connects[protocol] || [];
				connects[protocol].push(ws);

				ws.on('message', function(event) {
					console.log('websocket connection message');
					data = parse(event);

					if (data && data.type && handlersEvent[data.type]) {
						// нахожу обработчик, запускаю
						handlersEvent[data.type].call(this, data);
					}

				});
				ws.on('close', function(event) {
					data = parse(event);
					protocol = this.protocol;

					// освобождаю
					var i = connects[protocol].indexOf(ws);
					connects[protocol].splice(i, 1);
				});


				/**
				 * API like socket.io  для обратной совместимости
				 * @deprecated
				 * */


				ws.get = function(pageName, callback){
					return callback(null, this.protocol)
				};

				ws.broadcast = {

					to : function(protocol){
						return {
							emit : function(type, data){
								data['type'] = type;
								for (var i = 0; i < connects[protocol].length; i+=1) {
									if (connects[protocol] && connects[protocol][i] && connects[protocol][i] !== ws){
										connects[protocol][i].send(stringify(data))
									}
								}

							}
						}
					}
				}



			})
			//ошибка основного сервера
			.on('error', function(){

			})
			//заголовки
			.on('headers', function(){

			});


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
};
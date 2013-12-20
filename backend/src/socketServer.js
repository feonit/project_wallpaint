/**
 *
 * Add ws
 *
 * */

// Depends = eventSocket , ws;

exports.run = function(server){

	var that = this,
		wsServer,
		handlersEvent = WALL.loader.eventSocket,
		jsonParse = JSON.parse,
		jsonStringify = JSON.stringify;


	var connects = {};

	this.addWs = function(ws){
		connects[ws.protocol] = connects[ws.protocol] || [];
		connects[ws.protocol].push(ws);
	};
	this.removeWs = function(ws){
		var i = connects[ws.protocol].indexOf(ws);
		connects[ws.protocol].splice(i, 1);
	};

	function wrapApi(ws){
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
								if (connects[protocol][i].write){
									connects[protocol][i].write(jsonStringify(data))  //ws
								}
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Сервер на sockjs
	 *
	 * */


	var wsServer = WALL.loader.sockjs.createServer();

	wsServer.installHandlers(server, {prefix:'/echo'});

	wsServer.on('connection', function(ws) {
		console.log('connection' + ws);
		ws.on('close', function(){
			that.removeWs(ws)
		});
		ws.on('data', function(event){
			console.log('websocket connection message');
			var data = jsonParse(event);

			if (data && data.type && handlersEvent[data.type]) {
				// нахожу обработчик, запускаю
				handlersEvent[data.type].call(ws, data);
			}

		});
		wrapApi(ws);
		that.addWs(ws);
	});

	if (wsServer) {
		console.log('websocket server created');
	}
};
(function (App, $, WebSocket) {

	define( "socket",
		function () {

			var fn = {};

			fn.draw = function (draw) {
				App.drawLine(draw);
			};
			fn.uploadStore = function (data) {
				//App.store.getData(data);
				//App.store.drawStore();
			};
			fn.clearAllCanvas = function () {
				App.refresh();
			};

			/*	*//**
			 * Socket.io
			 *
			 * @deprecated
			 * *//*

			 var socketIO = function (host){
			 var socket = io.connect(App.HOST);

			 for (var event in fn) {
			 socket.on( event, fn[event])
			 }

			 return socket;
			 };*/

			/**
			 * ws
			 *
			 * */

			var nativeWebSocket = function () {
				var host = location.origin.replace(/^http/, 'ws'),
					subprotocol = App.PAGE,
					ws = new WebSocket(host, subprotocol);

				ws.onopen = function (event) {
					console.log('socket was open')
				};
				ws.onmessage = function (event) {
					console.log('socket new message');
					var data = JSON.parse(event.data);

					if (fn[data.type]) {
						fn[data.type](data)
					}
				};
				ws.onclose = function (event) {

				};
				ws.onerror = function (event) {

				};

				//todo додумать обработку send
				ws.emit = function (chanel, data){
					data['type'] = chanel;
					ws.send(JSON.stringify(data));
				};

				return ws;
			};

			return nativeWebSocket();
		});

})(App, jQuery, WebSocket);


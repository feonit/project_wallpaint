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
					ws = new WebSocket(host);

				ws.onopen = function (event) {
					console.log('socket was open')
				};
				ws.onmessage = function (event) {
					console.log('socket new message')

					if (fn[event.data.type]) {
						fn[event.data.type](event.data)
					}
				};
				ws.onclose = function (event) {

				};
				ws.onerror = function (event) {

				};

				//todo додумать обработку send
				ws.emit = function (chanel, data){
					data['type'] = chanel;
					ws.send(data);
				};

				return ws;
			};

			return nativeWebSocket();
		});

})(App, jQuery, WebSocket);


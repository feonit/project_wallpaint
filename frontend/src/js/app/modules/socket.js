define( ['sockjs'], function () {

	//вынести нахер отсюда весь app
	var subprotocol 	= App.PAGE,
		host 			= ('ws://') + location.host,
		ws 			= new WebSocket( host, subprotocol ),
		//ws 				= new SockJS('http://localhost:3000', undefined,{protocols_whitelist: []}),

		fn = {
			'draw' : function (draw) {
				App.drawLine(draw);
			},
			'uploadStore' : function (data) {
				//App.store.getData(data);
				//App.store.drawStore();
			},
			'clearAllCanvas' : function () {
				App.refresh();
			}
		};

	ws.onopen = function (event) {
		console.log('socket was open')
	};
	ws.onmessage = function (event) {
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
});

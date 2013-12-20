define( ['sockjs'], function () {
	var prefix = '/echo';
	var host = 'http://'+ location.host + prefix;

	return {
		socket : new SockJS(host),
		init : function (events){

			this.socket.onopen = function (){
				console.log('socket was open')
			};
			this.socket.onclose = function (){
				console.log('socket was close');
			};
			this.socket.onerror = function (){
				console.log('socket was error');
			};
			this.socket.onmessage = function (event){
				var data = JSON.parse(event.data);

				if (events[data.type]) {
					events[data.type](data)
				}
			};
			return this.socket;
		},
		emit : function (chanel, data){
			data['type'] = chanel;
			this.socket.send(JSON.stringify(data));
		}
	}

});

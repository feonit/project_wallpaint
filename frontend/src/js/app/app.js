require.config({

	baseUrl:		'/public/js/',
	waitSeconds:	10000,//urlArgs: "bust=" +  (new Date()).getTime(),
	paths:			{
		socketClient: 	'app/modules/socketClient',
		drawLine: 		'app/modules/drawLine',
		canvas: 		'app/modules/canvas',
		sockjs: 		'lib/sockjs'
	},
	shim: 			{
		socketClient	: 	{
			deps: ['sockjs']
		}
	}
});

define( ['socketClient', 'drawLine', 'canvas'], function (socketClient, drawLine, api){

	var options;

	options = {

		IMAGE_DATA_FIELD_NAME	: '#imageData'
	};

	$(function(){

		api.init();

		/**
		отобразить картинку если будет
*/
		$(options.IMAGE_DATA_FIELD_NAME).on('load', function() {
			api.canvas.ctx.drawImage(this,0,0);
		});

/**
		http://php-zametki.ru/javascript-laboratoriya/66-drag-and-drop-krossbrauzerno.html
*/
		document.onselectstart = function () {
			return false;
		};

		socketClient.init({
			'draw' : drawLine,
			'clearAllCanvas' : api.clear
		});

		//чтобы отследить очерёдность
		var mouseMove = false;

		function onMousedown(event){
			var mouse = api.getMouse(event),
				draw = api.createDraw(mouse.x, mouse.y);

			socketClient.emit('drawClick', draw);
			drawLine(draw);
			mouseMove = true;
		}

		function onMousemove(event){
			if(!mouseMove){
				return;
			}
			var mouse = api.getMouse(event),
				draw = api.createDraw(mouse.x, mouse.y);

			socketClient.emit('drawClick', draw);
			drawLine(draw);
		}

		function onMouseup(){
			var draw = api.createDraw(-100, -100);

			socketClient.emit('drawClick', draw);
			drawLine(draw);
			mouseMove = false;
		}

		var body = $("body");

		if ($.mobile){
			body.on('vmousedown', onMousedown);
			body.on('vmousemove', onMousemove);
			body.on('vmouseup', onMouseup);
		} else {
			body.on('mousedown', onMousedown);
			body.on('mousemove', onMousemove);
			body.on('mouseup', onMouseup);
		}
	});


	return {canvas : api.canvas};
});

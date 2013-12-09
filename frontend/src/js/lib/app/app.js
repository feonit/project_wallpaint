require.config({
	baseUrl: 'public/js/lib',

	waitSeconds: 10000,

	//urlArgs: "bust=" +  (new Date()).getTime(),

	paths: {
		jquery: 		'jquery/jquery.min',
		jqueryui: 		'jquery/jquery-ui',
		socket: 		'app/modules/socket',
		draw: 			'app/modules/draw',
		picker: 		'app/widgets/picker',
		slider: 		'app/widgets/slider',
		tools: 			'app/widgets/tools',
		colorpicker: 	'util/colorpicker'
		//socketio: 		'/socket.io/socket.io'
	}
});

var App = {
	DEFAULT_COLOR        : { r:0, g:0, b:0 }
	,DEFAULT_SIZE        : 3
	,DEFAULT_OPACITY     : 100
	,DEFAULT_HEIGHT      : 400
	,DEFAULT_WIDTH       : 600
	,DEFAULT_SCALE       : 100
	,MIN_SCALE           : 10
	,MAX_SCALE           : 400
	,SCALE               : 10
	,LOGIN               : "user" + new Date().getTime()
	,PAGE                : location.pathname.replace("/", "")
	,HOST                : (location.host.search('localhost')!==-1)? "127.0.0.1:" + location.port : location.host
};

require(['jquery', 'jqueryui', 'socket', 'draw', 'picker', 'slider', 'tools', 'colorpicker'],

	function ($, jqueryui, socket, reDraw, picker, slider, tools, colorpicker){


		App.socket = socket;

		App.reDraw = reDraw;

		App.drawLine = function (draw) {
			var x = draw.x
				, y = draw.y
				, r = draw.r
				, g = draw.g
				, b = draw.b
				, size = draw.size
				, opacity = draw.opacity / 100                  //todo избавиться от лишнеге дележа
				, color = 'rgb(' + r + ',' + g + ',' + b +')'   //стоит подумать о цвете, может не складывать
				, login = draw.login;


			if (opacity < 1) {
				var ourCanvas = $('#_'+login)[0];
				var canvas = ourCanvas || App.createCanvas("_"+login);


				if (x !== -100) {
					canvas.ctx.strokeStyle = color;
					canvas.ctx.lineWidth = size;
					canvas.ctx.globalAlpha = opacity;
					canvas.mouseXY.x.push(x);
					canvas.mouseXY.y.push(y);
					canvas.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
					return App.reDraw(canvas.mouseXY, canvas.ctx);
				} else {
					App.ctx.strokeStyle = color;
					App.ctx.globalAlpha = opacity;
					App.ctx.lineWidth = size;
					App.reDraw(canvas.mouseXY, App.ctx);
					canvas.mouseXY = {x:[], y:[]};
					canvas.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
				}
			} else{
				App.ctx.globalAlpha = 1;
				if (x == -100) {
					return App.storeByName[login] = [];
				}else {
					if (!App.storeByName[login]){
						App.storeByName[login] = [];
					}
					App.storeByName[login].push(draw);

					var store = App.storeByName[login];
					var i = App.storeByName[login].length - 1;

					App.ctx.strokeStyle = color;
					App.ctx.lineWidth = size;
					var touches = {x:[],y:[]};

					if (i<2){
						for (; i>=0 ;i--){
							touches.x.push(store[i].x);
							touches.y.push(store[i].y);
						}
					}else {
						for (var n=i-3; n<i ;){
							n++;
							touches.x.push(store[n].x);
							touches.y.push(store[n].y);
						}
					}
					return App.reDraw(touches, App.ctx);
				}
			}
		}

		App.createCanvas = function (login){
			var canvas = $('<canvas />')
				.appendTo('#allCanvas')[0];
			if ($('#allCanvas').children().length!==1)
				$(canvas).addClass('canvasLayer');

			canvas.id = login;
			canvas.height = App.DEFAULT_HEIGHT;
			canvas.width = App.DEFAULT_WIDTH;
			canvas.mouseXY = {x:[], y:[]};
			canvas.ctx = canvas.getContext("2d");
			canvas.ctx.lineCap = "round";
			canvas.ctx.lineJoin = "round";
			return canvas;
		}

		App.refresh = function() {
			App.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
			$('.canvasLayer').remove();
		}

		App.createDraw = function (x, y) {
			return {
				x:x
				, y:y
				, size:App.ctx.size
				, r:App.ctx.color.r
				, g:App.ctx.color.g
				, b:App.ctx.color.b
				, opacity:App.ctx.opacity
				, nameFromPath:App.PAGE
				, login:App.LOGIN
			};
		};


		/*    onReady     */


		$(function(){

			App.canvas = App.createCanvas(App.LOGIN);
			App.ctx    = App.canvas.ctx;

			App.ctx.color   = App.DEFAULT_COLOR;
			App.ctx.opacity = App.DEFAULT_OPACITY;
			App.ctx.size    = App.DEFAULT_SIZE;

			App.storeByName = {};

			App.demoPicker = picker.init(App.DEFAULT_SIZE);
			App.slider = slider.init();
			App.tools = tools.init();

			var place = $("#placeCanvas")[0],
				body = $("body"),
				allCanvas = $('#allCanvas');


			var imageData = $('#imageData');

			imageData.load(function() {
				App.ctx.drawImage(imageData[0],0,0);
			});



			var pic = document.getElementById('color-picker');

			if(pic){
				ColorPicker(pic, function (hex, hsv, rgb) {
					App.ctx.color = rgb;
					App.demoPicker.redrawPicker();
				});
			}


			// http://php-zametki.ru/javascript-laboratoriya/66-drag-and-drop-krossbrauzerno.html
			document.onselectstart = function () {
				return false;
			};

			var canvasMove = true;
			var mouseMove = false;



			allCanvas.draggable({ opacity: 1.0 });
			allCanvas.draggable( "option", "disabled", true );

			$('#slider-panel').draggable();
			$('#color-panel').draggable();
			$('#image-panel').draggable();

			function getXY(){
				var canvas = $('canvas')[0];
				var allCanvas = $('#allCanvas')[0];
				var differenceWidth = canvas.offsetWidth/App.canvas.width;
				var differenceHeight = canvas.offsetHeight/App.canvas.height;
				var x = Math.floor(((event.pageX - place.offsetLeft - allCanvas.offsetLeft - canvas.offsetLeft)/differenceWidth));
				var y = Math.floor(((event.pageY - place.offsetTop - allCanvas.offsetTop - canvas.offsetTop)/differenceHeight));
				return {x:x,y:y}
			}


			function onMousedown(event){
				if(event.button)return;

				var mouse = getXY();
				var x = mouse.x;
				var y = mouse.y;

				var draw = App.createDraw(x, y);
				App.socket.emit('drawClick', draw);
				App.drawLine(draw);
				mouseMove = true;
			}
			function onMousemove(event){
				if(!mouseMove&&canvasMove)return;
				if(event.button)return;

				var mouse = getXY();
				var x = mouse.x;
				var y = mouse.y;

				var draw = App.createDraw(x, y);
				App.socket.emit('drawClick', draw);
				App.drawLine(draw);

			}
			function onMouseup(){
				mouseMove = false;
				var draw = App.createDraw(-100, -100);
				App.socket.emit('drawClick', draw);
				App.drawLine(draw);
			}

			function onMouseWheel(event){
				event.stopPropagation();
				event.preventDefault();
				if(event.originalEvent instanceof WheelEvent){
					var value = sliderScale.slider( "option", "value");
					value += event.originalEvent.wheelDelta/120;
					if(value>App.MIN_SCALE && value < App.MAX_SCALE){
						sliderScale.slider( "option", "value", value );
					}
				}
				return false;
			}



			allCanvas.bind('mousewheel', onMouseWheel);
			allCanvas.bind('mousewheel', onMouseWheel);
			allCanvas.bind('click', function (event){
				if(event.button==1){
					onDrag();
				}
			});


			body.bind('mousedown', onMousedown);
			body.bind('mousemove', onMousemove);
			body.bind('mouseup', onMouseup);

			//App.socket.emit('uploadDraw', {nameFromPath:App.PAGE});
		});



	});

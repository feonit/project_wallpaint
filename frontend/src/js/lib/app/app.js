require.config({
	paths: {
		jquery: 		'/public/js/lib/jquery/jquery.min',
		socket: 		'/public/js/lib/app/socket',
		picker: 		'/public/js/lib/app/picker',
    draw: 		'/public/js/lib/app/draw',
		colorpicker: 	'/public/js/lib/util/colorpicker',
		jqueryui: 		'/public/js/lib/jquery/jquery-ui'
		//socketio: 		'/socket.io/socket.io'
	}
});

var App = {};

require(['jquery', 'socket', 'picker', 'draw', 'colorpicker', 'jqueryui', ],

	function($, socket, picker, _draw){

		App.DEFAULT_COLOR       = { r:0, g:0, b:0 };
		App.DEFAULT_SIZE        = 3;
		App.DEFAULT_OPACITY     = 100;
		App.DEFAULT_HEIGHT      = 400;
		App.DEFAULT_WIDTH       = 600;
		App.LOGIN               = "user" + new Date().getTime();
		App.PAGE                = location.pathname.replace("/", "");

		App.DEFAULT_SCALE       = 100;
		App.MIN_SCALE           = 10;
		App.MAX_SCALE           = 400;
		App.SCALE               = 10;

		App.HOST = (location.host.search('localhost')!==-1)? "127.0.0.1:" + location.port : location.host;

		App.socket = socket;


		App.store = {
			data:[],
			count:0,
			getData:function (data) {
				this.data = data;
				this.count += data.length;
			},
			drawStore: function(){
				var count = this.count;
				for (var i = 0; i < count; i++) {
					App.drawLine(App.store.data[i]);
				}
			}
		};

		App.reDraw = _draw;

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

		App.init = function () {

			App.canvas = App.createCanvas(App.LOGIN);
			App.ctx    = App.canvas.ctx;

			App.ctx.color   = App.DEFAULT_COLOR;
			App.ctx.opacity = App.DEFAULT_OPACITY;
			App.ctx.size    = App.DEFAULT_SIZE;

			App.storeByName = {};

      App.demoPicker = picker.init(App.DEFAULT_SIZE);

    };


		/*    onReady     */


		$(function(){

			App.init();
			App.demoPicker.init();

			var place = $("#placeCanvas")[0],
				body = $("body"),
				sliderScale = $( "#sliderScale"),
				sliderSize = $("#sliderSize"),
				sliderOpacity = $("#sliderOpacity"),
				allCanvas = $('#allCanvas');


			var imageData = $('#imageData');
			imageData.load(function() {
				App.ctx.drawImage(imageData[0],0,0);
			});

			var changeScale = function (event, ui) {
				var w = place.offsetWidth/100;
				var h = place.offsetHeight/100;

				var l = allCanvas[0].offsetLeft;
				var t = allCanvas[0].offsetTop;

				var size = ui.value;
				if(size>100){
					allCanvas.css('left', -Math.abs(((size - 100)/2) ) + '%');
					allCanvas.css('top' , -Math.abs(((size - 100)/2) ) + '%');
				} else {
					allCanvas.css('left', Math.abs(((size - 100)/2)) +'%');
					allCanvas.css('top',  Math.abs(((size - 100)/2)) +'%');
				}
				allCanvas.css('width', size + "%");
				allCanvas.css('height', size + "%");
			}

			sliderOpacity.slider({
				min:1, max:100, step:1, value:App.DEFAULT_OPACITY, animate:"fast", orientation:"horizontal", range:false,
				slide:function (event, ui) {
					App.ctx.opacity = ui.value;
					App.demoPicker.redrawPicker();
					canvasMove = false;
				},
				start:function(event){
					event.stopImmediatePropagation();
				},
				stop : function(){
					canvasMove = true;
				}
			});
			sliderSize.slider({
				min:1, max:100, step:1, value:App.DEFAULT_SIZE, animate:"fast", orientation:"horizontal", range:false,
				slide:function (event, ui) {
					var differenceWidth = place.offsetWidth/App.canvas.width;
					var size = ui.value;
					//var differenceHeight = place.offsetHeight/App.canvas.height;
					App.ctx.size = size/differenceWidth;
					App.demoPicker.redrawPicker(size);
					canvasMove = false;
				},
				start:function(event){
					event.stopImmediatePropagation();
				},
				stop : function(){
					canvasMove = true;
				}
			});
			sliderScale.slider({
				min:10, max:400, step:1, value:App.DEFAULT_SCALE, animate:"fast", orientation:"horizontal", range:false,
				change:changeScale,
				slide:changeScale,
				start:function(event){
					body.unbind('mousedown', onMousedown);
					event.stopImmediatePropagation();
				},
				stop : function(){
					body.bind('mousedown', onMousedown);
				}
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


			function onClear() {
				App.refresh();
				App.socket.emit('clearAllCanvas', {nameFromPath:App.PAGE});
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
			function onDrag(){
				var isDisabled = allCanvas.draggable( "option", "disabled" );
				if(isDisabled){
					allCanvas.draggable( "option", "disabled", false );
					body.unbind('mousedown', onMousedown);
					allCanvas.css('cursor','all-scroll')
				}else{
					allCanvas.draggable( "option", "disabled", true );
					body.bind('mousedown', onMousedown);
					allCanvas.css('cursor','crosshair')
				}
			}
			function onEraser(){
				App.ctx.color = {r: 255, g: 255, b: 255};
			}
			function onZoomOut(){
				var value = sliderScale.slider( "option", "value") - App.SCALE;
				if(value > App.MIN_SCALE){
					sliderScale.slider( "option", "value", value );
				}
			}
			function onZoomIn(){
				var value = sliderScale.slider( "option", "value") + App.SCALE;
				if (value < App.MAX_SCALE){
					sliderScale.slider( "option", "value", value );
				}
			};
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


			$("#clear").bind('click', onClear);
			$("#eraser").bind('click', onEraser);
			$("#zoomOut").bind('click', onZoomOut);
			$("#zoomIn").bind('click', onZoomIn);
			$("#hand").bind('click', onDrag);

			$('.side').bind('blur')

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

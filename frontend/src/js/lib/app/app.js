require.config({
	baseUrl: 'public/js/lib',

	waitSeconds: 10000,

	//urlArgs: "bust=" +  (new Date()).getTime(),

	paths: {
		jquery: 		'jquery/jquery.min',
		jqueryui: 	'jquery/jquery-ui',
		socket: 		'app/modules/socket',
		curve: 			'app/modules/curve',
		drawLine: 	'app/modules/drawLine',
		picker: 		'app/widgets/picker',
		slider: 		'app/widgets/slider',
		tools: 			'app/widgets/tools',
		colorpicker:'util/colorpicker'
		//socketio: 		'/socket.io/socket.io'
	}
});

var App = {
	DEFAULT_COLOR        : { r:0, g:0, b:0 }
	,DEFAULT_SIZE        : 3
	,DEFAULT_OPACITY     : 100
	,DEFAULT_HEIGHT      : 400
	,DEFAULT_WIDTH       : 400
	,DEFAULT_SCALE       : 100
	,MIN_SCALE           : 10
	,MAX_SCALE           : 400
	,SCALE               : 10
	,LOGIN               : "user" + new Date().getTime()
	,PAGE                : location.pathname.replace("/", "")
	,HOST                : location.host.search('localhost')!==-1 ? "127.0.0.1:" + location.port : location.host
};

require(['jquery', 'jqueryui', 'socket', 'curve', 'drawLine', 'picker', 'slider', 'tools', 'colorpicker'],

	function ($, jqueryui, socket, reDraw, drawLine, picker, slider, tools, colorpicker){


		App.socket = socket;

		App.reDraw = reDraw;
		
		App.drawLine = drawLine;

		App.createCanvas = function (login){
			var canvas = $('<canvas>')
				.appendTo('#allCanvas')[0];
			if ($('#allCanvas').children().length!==1);

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
			$('canvas:not(:first-child)').remove();
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


			App.demoPicker = picker.init(App.DEFAULT_SIZE);
			App.slider = slider.init();
			App.tools = tools.init();

			var allCanvas = $('#allCanvas');
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


			//переместить в функционал перемещения если будет
			//allCanvas.draggable({ opacity: 1.0 });
			//allCanvas.draggable( "option", "disabled", true );

			//$('#slider-panel').draggable();
			//$('#color-panel').draggable();
			//$('#image-panel').draggable();
			
			

			function getXY(){
				var canvas = getXY.canvas,
				allCanvas = getXY.allCanvas;
				
				//todo доделать без натива
				differenceWidth = canvas.offsetWidth/App.canvas.width,
				differenceHeight = canvas.offsetHeight/App.canvas.height;

				return {
					x : Math.floor(((event.pageX - allCanvas.offsetLeft - canvas.offsetLeft)/differenceWidth)),
					y : Math.floor(((event.pageY - allCanvas.offsetTop - canvas.offsetTop)/differenceHeight))
				}
			}
			getXY.canvas = $('canvas')[0];
			getXY.allCanvas = $('#allCanvas')[0];
			
			//чтобы отследить очерёдность
			var mouseMove = false;
			
			function onMousedown(event){
				if (event.button !== 0) {
					return;
				}

				var mouse = getXY(),
					x = mouse.x,
					y = mouse.y;

				var draw = App.createDraw(x, y);
				App.socket.emit('drawClick', draw);
				App.drawLine(draw);
				mouseMove = true;
			}
			
			function onMousemove(event){
				if(!mouseMove){
					return;
				}
				if(event.button !== 0) {
					return;
				}

				var mouse = getXY(),
					x = mouse.x,
					y = mouse.y,
					draw = App.createDraw(x, y);
					
				App.socket.emit('drawClick', draw);
				App.drawLine(draw);
			}
			
			function onMouseup(){
				var draw = App.createDraw(-100, -100);
			
				App.socket.emit('drawClick', draw);
				App.drawLine(draw);
				mouseMove = false;
			}

			function onMouseWheel(event){
				event.stopPropagation();
				event.preventDefault();
				
				if (event.originalEvent instanceof WheelEvent) {
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

			var body = $("body");
				
			body.bind('mousedown', onMousedown);
			body.bind('mousemove', onMousemove);
			body.bind('mouseup', onMouseup);

			//App.socket.emit('uploadDraw', {nameFromPath:App.PAGE});
		});



	});

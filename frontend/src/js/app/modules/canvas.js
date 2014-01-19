define(function() {
	var api = {},
		options,
		canvas,
		parent;

	options = {

		DEFAULT_COLOR			: { r:0, g:0, b:0 }
		,DEFAULT_SIZE			: 3
		,DEFAULT_OPACITY		: 100
		,DEFAULT_HEIGHT			: 400
		,DEFAULT_WIDTH			: 400
		,CANVAS_FIELD_NAME		: '#allCanvas'

		,PAGE					: location.pathname.replace("/", "")   //! todo
		,LOGIN					: "user" + new Date().getTime()

	};

	api.createCanvas = function (login) {
		var $newCanvas, newCanvas;

		$newCanvas = $('<canvas>').appendTo(parent);

		$newCanvas.attr({
			id		: login,
			height 	: options.DEFAULT_HEIGHT,
			width 	: options.DEFAULT_WIDTH
		});

		newCanvas = $newCanvas[0];

		newCanvas.ctx = $newCanvas[0].getContext("2d"),
		newCanvas.ctx.lineCap = "round";
		newCanvas.ctx.lineJoin = "round";

		newCanvas.mouseXY	= {
			x: [], y: []
		};
		newCanvas.pencil = {
			color	: options.DEFAULT_COLOR,
			opacity	: options.DEFAULT_OPACITY,
			size	: options.DEFAULT_SIZE
		}
		return newCanvas;
	};



	api.createDraw = function (x, y) {

		return {
			x:x
			, y:y
			, size:			canvas.pencil.size
			, r:			canvas.pencil.color.r
			, g:			canvas.pencil.color.g
			, b:			canvas.pencil.color.b
			, opacity:		canvas.pencil.opacity
			, nameFromPath:	options.PAGE
			, login:		options.LOGIN
		};
	};

	api.clear = function () {
		canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
		$('canvas:not(:first-child)').remove();
	};

	api.getMouse = function (event){
		//todo доделать без натива
		var differenceWidth = canvas.offsetWidth/canvas.width,
			differenceHeight = canvas.offsetHeight/canvas.height;

		return {
			x : Math.floor(((event.pageX - parent.offsetLeft - canvas.offsetLeft)/differenceWidth)),
			y : Math.floor(((event.pageY - parent.offsetTop - canvas.offsetTop)/differenceHeight))
		}
	}

	api.init = function(){
		api.parent = parent = $(options.CANVAS_FIELD_NAME)[0];
		api.canvas = canvas = api.createCanvas(options.PAGE);
	};


	return api;
})
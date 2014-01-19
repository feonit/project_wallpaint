define(['jquery', 'app'], function( $ , App) {
	var options;

	options = {


		DEFAULT_SCALE			: 100
		,MIN_SCALE				: 10
		,MAX_SCALE				: 400
		,SCALE					: 10

	};

	return {
		init : function(){
			var sliderScale 	= $( "#sliderScale"),
				sliderSize 		= $("#sliderSize"),
				sliderOpacity 	= $("#sliderOpacity"),
				body = $("body"),
				allCanvas = $('#allCanvas');

			var changeScale = function (event, ui) {
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
				min:1, max:100, step:1, value:options.DEFAULT_OPACITY, animate:"fast", orientation:"horizontal", range:false,
				slide:function (event, ui) {
					App.ctx.opacity = ui.value;
					App.demoPicker.redrawPicker();
				},
				start:function(event){
					event.stopImmediatePropagation();
				},
				stop : function(){
				}
			});

			sliderSize.slider({
				min:1, max:100, step:1, value:options.DEFAULT_SIZE, animate:"fast", orientation:"horizontal", range:false,
				slide:function (event, ui) {
					var differenceWidth = place.offsetWidth/App.canvas.width;
					var size = ui.value;
					//var differenceHeight = place.offsetHeight/App.canvas.height;
					App.ctx.size = size/differenceWidth;
					App.demoPicker.redrawPicker(size);
				},
				start:function(event){
					event.stopImmediatePropagation();
				},
				stop : function(){
				}
			});

			sliderScale.slider({
				min:10, max:400, step:1, value:options.DEFAULT_SCALE, animate:"fast", orientation:"horizontal", range:false,
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

			//				function onMouseWheel(event){
//					event.stopPropagation();
//					event.preventDefault();
//
//					if (event.originalEvent instanceof WheelEvent) {
//						var value = sliderScale.slider( "option", "value");
//
//						value += event.originalEvent.wheelDelta/120;
//						if(value>options.MIN_SCALE && value < options.MAX_SCALE){
//							sliderScale.slider( "option", "value", value );
//						}
//					}
//					return false;
//				}
		}
	}
})

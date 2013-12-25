define(['jquery', 'app'], function( $ , App) {
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
				min:1, max:100, step:1, value:App.DEFAULT_OPACITY, animate:"fast", orientation:"horizontal", range:false,
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
				min:1, max:100, step:1, value:App.DEFAULT_SIZE, animate:"fast", orientation:"horizontal", range:false,
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
		}
	}
})

(function (App, $) {

	define( "tools",

	function () {

		return {
			init: function(){

				var onDrag = function(){

					var allCanvas = $('#allCanvas'),
						isDisabled = allCanvas.draggable( "option", "disabled" );

					if (isDisabled) {
						allCanvas.draggable( "option", "disabled", false );
						allCanvas.css('cursor','all-scroll')
					} else {
						allCanvas.draggable( "option", "disabled", true );
						allCanvas.css('cursor','crosshair')
					}
				}

				var onEraser = function (){
					App.ctx.color = {r: 255, g: 255, b: 255};
				}

				var onZoomOut = function (){
					var value = sliderScale.slider( "option", "value") - App.SCALE;
					if(value > App.MIN_SCALE){
						sliderScale.slider( "option", "value", value );
					}
				}

				var onZoomIn = function (){
					var value = sliderScale.slider( "option", "value") + App.SCALE;
					if (value < App.MAX_SCALE){
						sliderScale.slider( "option", "value", value );
					}
				}

				var onClear = function () {
					App.refresh();
					App.socket.emit('clearAllCanvas', {nameFromPath:App.PAGE});
				}

				$("#clear").bind('click', onClear);
				$("#eraser").bind('click', onEraser);
				$("#zoomOut").bind('click', onZoomOut);
				$("#zoomIn").bind('click', onZoomIn);
				$("#hand").bind('click', onDrag);

			}
		}
	})

})(App, jQuery);
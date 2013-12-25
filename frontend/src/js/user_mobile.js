require.config({
	paths: {
		app: 			'/public/js/app/app',
		jquery: 		'lib/jquery/jquery-1.10.2',  // todo убрать повторы определений как то нужно
		jquerymobile: 	'lib/jquery/jquery.mobile',
		colorpicker:	'lib/colorpicker'
	},
	shim: {
        'app': {
            deps: ['jquery'],
            exports: 'App'
        },
        'jquerymobile': {
            deps: ['jquery'],
            //exports: 'jquerymobile'
        }
    }
});

require(['jquery', 'app', 'jquerymobile', 'colorpicker'], function($, App){

		$(function() {
		
				var pic = document.getElementById('color-picker');
	
			//init colorpicker
			if(pic){
				ColorPicker(pic, function (hex, hsv, rgb) {
					App.ctx.color = rgb;
					//App.demoPicker.redrawPicker();
				});
			}
			
			// init panel
			$( "body>[data-role='panel']" ).panel();
			
			//<!--отсключение скрола-->
			document.body.addEventListener('touchmove', function(event) {
				event.preventDefault();
			}, false);
			
		});
		


	}

);

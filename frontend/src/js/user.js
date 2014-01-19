require.config({
	paths: {
		app: 			'/public/js/app/app',
		jquery: 		'lib/jquery/jquery',
		colorpicker:	'lib/colorpicker',
		jqueryui: 		'lib/jquery/jquery-ui',
		picker: 		'app/widgets/picker',
		slider: 		'app/widgets/slider'
	},
	shim: {
	    'app': {
            deps: ['jquery', 'jqueryui'],
            exports: 'App'
        },
        'jqueryui': {
            deps: ['jquery']
            //exports: 'jqueryui'
        },
        'colorpicker': {
            //deps: ['jquery'],
            //exports: 'ColorPicker'
        },
        'picker': {
            deps: ['jquery', 'app']
            //exports: ''
        },
        'slider': {
            deps: ['jquery', 'app']
            //exports: ''sliderOpacity changeScale sliderSize //todo избавиться от этого гавна в глобали
        }
    }
});

require(['app', 'colorpicker', 'picker', 'slider'], function(App) {
		
	var pic = document.getElementById('color-picker');
	
	//init colorpicker
	if(pic){
		ColorPicker(pic, function (hex, hsv, rgb) {
			App.ctx.color = rgb;
			//App.demoPicker.redrawPicker();
		});
	}
	//init picker - разрулить двустороннюю зависимость в require.js  app <---> picker
	//App.demoPicker = picker.init(App.DEFAULT_SIZE);
	
	//init sliders
	//App.slider = slider.init();
	
});

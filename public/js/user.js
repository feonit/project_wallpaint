require.config({
	paths: {
		jquery: 		'/public/js/lib/jquery/jquery.min',
		app: 			'/public/js/lib/app/app'
	}
});

require(['jquery', 'app'],

	function($, app){}

);
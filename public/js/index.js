require.config({
	paths: {
		jquery: 		'/public/js/lib/jquery/jquery.min',
		jqueryCookie: 		'/public/js/lib/jquery/jquery.min'
	}
});

require(
	['jquery', 'jqueryCookie'],
		function( $ ){

		var submit = $('#submit')[0]
		  , user = $('#user')[0]
		  , email = $('#email')[0]

		submit.onclick= function(){
		  $.cookie('user', user.value);
		  $.cookie('email', email.value);
		}

	});


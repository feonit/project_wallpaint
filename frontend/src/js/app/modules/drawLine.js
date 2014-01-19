require.config({

	baseUrl:		'/public/js/',
	paths:			{
		curve: 			'app/modules/curve',
		canvas: 		'app/modules/canvas'
	}
});

define(['curve', 'canvas'], function(curve, api) {
	var member,
		cache = {};

	member = function (login){

		member[login] = member[login] || $('#_' + login)[0] || canvas.createCanvas("_" + login);
		
		return member[login];
	}


	return function (draw) {
		var x = draw.x
			, y = draw.y
			, r = draw.r
			, g = draw.g
			, b = draw.b
			, size = draw.size
			, opacity = draw.opacity / 100
			, color = 'rgb(' + r + ',' + g + ',' + b +')'   //стоит подумать о цвете, может не складывать
			, login = draw.login;

		// режим прозрачности, работает медленее, по возможности

		if (opacity < 1) {

			var canvas = member(login);

			if (x !== -100) {

				canvas.ctx.strokeStyle = color;
				canvas.ctx.lineWidth = size;
				canvas.ctx.globalAlpha = opacity;

				canvas.mouseXY.x.push(x);
				canvas.mouseXY.y.push(y);

				canvas.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
				return curve(canvas.mouseXY, canvas.ctx);
			} else {
				api.canvas.ctx.strokeStyle = color;
				api.canvas.ctx.globalAlpha = opacity;
				api.canvas.ctx.lineWidth = size;
				curve(canvas.mouseXY, api.canvas.ctx);
				canvas.mouseXY = {x:[], y:[]};
				canvas.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
			}

			// режим обычный, работает быстрее

		} else {

			if (x !== -100) {

				var touches = {x:[],y:[]},
					member = (cache[login] = cache[login] || []),
					i, n;

				member.push(draw);

				i = member.length;

				// для первой точки или прямой (соответственно для 1 или 2х точек)
				if ( i < 3 ) {
					for ( n = i; n > 0; n -=1 ) {
						touches.x.push(member[n - 1].x);
						touches.y.push(member[n - 1].y);
					}
					// последующие идут как кривые, берём последние 3 точки
				} else {
					for ( n = 0; n < 3 ; n += 1 ) {
						touches.x.push(member[i - n - 1].x);
						touches.y.push(member[i - n - 1].y);
					}

				}

				api.canvas.ctx.strokeStyle = color;
				api.canvas.ctx.lineWidth = size;
				api.canvas.ctx.globalAlpha = 1;
				curve(touches, api.canvas.ctx);

			} else {
				// завершающий сигнал

				return cache[login] = [];
			}
		}
	}

});

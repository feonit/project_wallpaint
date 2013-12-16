define(['curve'], function(curve) {

		var cache = {}
			
			
		function memberDomCanvas (login){
		
			memberDomCanvas[login] = memberDomCanvas[login] || $('#_' + login)[0] || App.createCanvas("_" + login);
			
			return memberDomCanvas[login];
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

				var canvas = memberDomCanvas(login);

				if (x !== -100) {
				
					canvas.ctx.strokeStyle = color;
					canvas.ctx.lineWidth = size;
					canvas.ctx.globalAlpha = opacity;
					
					canvas.mouseXY.x.push(x);
					canvas.mouseXY.y.push(y);
					
					canvas.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
					return curve(canvas.mouseXY, canvas.ctx);
				} else {
					App.ctx.strokeStyle = color;
					App.ctx.globalAlpha = opacity;
					App.ctx.lineWidth = size;
					curve(canvas.mouseXY, App.ctx);
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
					
					App.ctx.strokeStyle = color;
					App.ctx.lineWidth = size;
					App.ctx.globalAlpha = 1;
					
					return curve(touches, App.ctx);

				} else {
					// завершающий сигнал
					
					return cache[login] = [];
				}
			}
		}
});

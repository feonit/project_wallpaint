define(function() {
  return function (touches, ctx){
	  if (!touches || !touches.x || typeof(touches.x[0])!=="number") {
		  return false;
	  }
	  ctx.beginPath();
	  ctx.moveTo(touches.x[0], touches.y[0]);

	  if (touches.x.length < 2) {
		  ctx.lineTo(touches.x[0] + 0.51, touches.y[0]);
	  }
	  else if (touches.x.length < 3) {
		  ctx.lineTo(touches.x[1], touches.y[1]);
	  }
	  else {
		  ctx.moveTo((touches.x[0] + touches.x[1]) * 0.5, (touches.y[0] + touches.y[1]) * 0.5);
		  var i = 0;
		  while (++i < (touches.x.length - 1)) {
			  var abs1 = Math.abs(touches.x[i - 1] - touches.x[i]) + Math.abs(touches.y[i - 1] - touches.y[i])
				  + Math.abs(touches.x[i] - touches.x[i + 1]) + Math.abs(touches.y[i] - touches.y[i + 1]);
			  var abs2 = Math.abs(touches.x[i - 1] - touches.x[i + 1]) + Math.abs(touches.y[i - 1] - touches.y[i + 1]);
			  if (abs1 > 10 && abs2 > abs1 * 0.8) {
				  ctx.quadraticCurveTo(touches.x[i], touches.y[i], (touches.x[i] + touches.x[i + 1]) * 0.5, (touches.y[i] + touches.y[i + 1]) * 0.5);
			  } else {
				  ctx.lineTo((touches.x[i] + touches.x[i+1]) * 0.5, (touches.y[i] + touches.y[i+1]) * 0.5);
			  }
		  }
		  //ctx.moveTo(touches.x[touches.x.length - 1] , touches.y[touches.y.length - 1] );
	  }
	  ctx.stroke();
	  return ctx.closePath();
  }
})

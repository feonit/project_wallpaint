define(['jquery', 'app'], function( $ , App) {
  return {
	  canvas : undefined,
	  ctx : undefined,
	  size : 100,
	  init : function(size){
		  var $parent, canvas;

		  $parent = $('#demoPicker');
		  canvas = $('<canvas>')[0];

		  canvas.width=this.size;
		  canvas.height=this.size;

		  if ($parent.length) {
			  $parent.append(canvas);
		  }

		  this.canvas = canvas;
		  this.ctx = canvas.getContext("2d");
		  this.ctx.lineCap = "round";
		  this.ctx.lineJoin = "round";
		  return this.redrawPicker(size);
	  },
	  redrawPicker : function(size){
		  var color = App.ctx.color,
		    opacity = App.ctx.opacity,
		    style = "rgb("+color.r+","+color.g+","+color.b+")",
		    ctx = this.ctx,
		    center = this.size/2;

		  ctx.strokeStyle = style;
		  ctx.lineWidth = size;
		  ctx.globalAlpha = opacity/100;
		  ctx.clearRect(0, 0, this.size, this.size);
		  ctx.beginPath();
		  ctx.moveTo(center, center);
		  ctx.lineTo(center + 0.51, center);
		  ctx.stroke();
		  ctx.closePath();
		  return true;
	  }
	}
})

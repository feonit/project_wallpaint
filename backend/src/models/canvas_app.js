/*
 *
 *  Module canvas_app
 *
 *  Module allows you to create a canvas of the available data
 *
 * */

var main = require('../main');

var Canvas = main.Canvas;
var io = main.io;

var App = module.exports = {};

App.DEFAULT_COLOR       = { r:0, g:0, b:0 };
App.DEFAULT_SIZE        = 3;
App.DEFAULT_OPACITY     = 100;
App.DEFAULT_HEIGHT      = 400;
App.DEFAULT_WIDTH       = 600;

App.init = function(){
    App.storeByName = {};
    App.LOGIN = "user" + new Date().getTime();
    App.mem = {};
};

App.store = {
  data:[],
  count:0,
  getData:function (data) {
    this.data = data;
    this.count = data.length;
  },
  drawStore: function(){
    var count = this.count;
    for (var i = 0; i < count; i++) {
      App.drawLine(App.store.data[i]);
    }
  }
};

App.createCanvas = function (login){

  var canvas = new Canvas(App.DEFAULT_HEIGHT,App.DEFAULT_WIDTH);
  App.mem[login]=canvas;

  canvas.id = login;
  canvas.height = App.DEFAULT_HEIGHT;
  canvas.width = App.DEFAULT_WIDTH;
  canvas.mouseXY = {x:[], y:[]};
  canvas.ctx = canvas.getContext("2d");
  canvas.ctx.lineCap = "round";
  canvas.ctx.lineJoin = "round";
  return canvas;
}


App.reDraw = function (touches, ctx){
  if(typeof(touches.x[0])!=="number")return;
  ctx.beginPath();
  ctx.moveTo(touches.x[0], touches.y[0]);
  if (touches.x.length < 2) {
    ctx.lineTo(touches.x[0] + 0.51, touches.y[0]);
  } else if (touches.x.length < 3) {
    ctx.lineTo(touches.x[1], touches.y[1]);
  } else {
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

App.drawLine = function (draw) {
    var x = draw.x
        , y = draw.y
        , r = draw.r
        , g = draw.g
        , b = draw.b
        , size = draw.size
        , opacity = draw.opacity / 100                  //todo избавиться от лишнеге дележа
        , color = 'rgb(' + r + ',' + g + ',' + b +')'   //стоит подумать о цвете, может не складывать
        , login = draw.login;


    if (opacity < 1) {
        var canvas = App.mem[login] || App.createCanvas("_"+login);


        if (x !== -100) {
            canvas.ctx.strokeStyle = color;
            canvas.ctx.lineWidth = size;
            canvas.ctx.globalAlpha = opacity;
            canvas.mouseXY.x.push(x);
            canvas.mouseXY.y.push(y);
            canvas.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
            return App.reDraw(canvas.mouseXY, canvas.ctx);
        } else {
            App.ctx.strokeStyle = color;
            App.ctx.globalAlpha = opacity;
            App.ctx.lineWidth = size;
            App.reDraw(canvas.mouseXY, App.ctx);
            canvas.mouseXY = {x:[], y:[]};
            canvas.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
        }
    } else{
        App.ctx.globalAlpha = 1;
        if (x == -100) {
            return App.storeByName[login] = [];
        }else {
            if (!App.storeByName[login]){
                App.storeByName[login] = [];
            }
            App.storeByName[login].push(draw);

            var store = App.storeByName[login];
            var i = App.storeByName[login].length - 1;

            App.ctx.strokeStyle = color;
            App.ctx.lineWidth = size;
            var touches = {x:[],y:[]};

            if (i<2){
                for (; i>=0 ;i--){
                    touches.x.push(store[i].x);
                    touches.y.push(store[i].y);
                }
            }else {
                for (var n=i-3; n<i ;){
                    n++;
                    touches.x.push(store[n].x);
                    touches.y.push(store[n].y);
                }
            }
            return App.reDraw(touches, App.ctx);
        }
    }
};
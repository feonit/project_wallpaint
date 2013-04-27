var App;
App = {};

App.DEFAULT_COLOR       = { r:0, g:0, b:0 };
App.DEFAULT_SIZE        = 10;
App.DEFAULT_OPACITY     = 10;
App.DEFAULT_HEIGHT      = 2480;
App.DEFAULT_WIDTH       = 3508;
App.LOGIN               = "user" + new Date().getTime();
App.PAGE                = location.pathname.replace("/", "");


App.store = {
  data:[],
  count:0,
  getData:function (data) {
    this.data = data;
    this.count += data.length;
  },
  drawStore: function(){
    var count = this.count;
    for (var i = 0; i < count; i++) {
      App.drawLine(App.store.data[i]);
    }
  }
};

App.storeCanvas = {
  count:0,
  canvasLogins:{},
  newCanvasCtx:function (login) {
    var canvas = $('<canvas />')[0];
    canvas.id = 'canvas_' + this.count++;
    canvas.ctx = canvas.getContext("2d");
    canvas.login = login;
    canvas.height = App.DEFAULT_HEIGHT;
    canvas.width = App.DEFAULT_WIDTH;
    canvas.mouseXY = {x:[], y:[]};
    canvas.ctx = canvas.getContext("2d");
    canvas.ctx.lineCap = "round";
    canvas.ctx.lineJoin = "round";
    $('#placeCanvas')[0].appendChild(canvas);
      if(login!=='default'){
        var offset = $('#canvas_0').offset();
        var canvasFromDom = $('#'+canvas.id);
        canvasFromDom.addClass('canvasLayer');
        this.canvasLogins[login] = canvas;
      }
    return canvas;
  },
  deleteCanvas:function (canvas) {
    delete this.canvasLogins[canvas.login];
    var placeCanvas = document.getElementById("placeCanvas")
      , canvas = document.getElementById(canvas.id);
    return placeCanvas.removeChild(canvas);
  },
  refresh : function() {
    App.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
    for (var login in this.canvasLogins)App.storeCanvas.deleteCanvas(this.canvasLogins[login]);
  }
};

App.demoPicker = {
  canvas : undefined,
  ctx : undefined,
  size : 100
  ,
  init : function(){
    var parent = $('#demoPicker')[0];
    var canvas = $('<canvas />')[0];
    canvas.width=this.size;
    canvas.height=this.size;

    parent.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    return this.redrawPicker();
  },
  redrawPicker : function(size){
    var color = App.ctx.color;
    var opacity = App.ctx.opacity;
    var style = "rgb("+color.r+","+color.g+","+color.b+")";
    var ctx = this.ctx;
    var center = this.size/2;
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

App.init = function () {

  App.canvas = App.storeCanvas.newCanvasCtx('default');
  App.ctx = App.canvas.ctx;

  App.ctx.color = App.DEFAULT_COLOR;
  App.ctx.opacity = App.DEFAULT_OPACITY;
  App.ctx.size = App.DEFAULT_SIZE;

  App.storeByName = {};

  App.socket = (function(host){
    var socket = io.connect(host)
      .on('draw', function (draw) {
        App.drawLine(draw);
      })
      .on('uploadStore', function (data) {
        App.store.getData(data);
        App.store.drawStore();
      })
      .on('clearAllCanvas', function () {
        App.storeCanvas.refresh();
      });
    return socket;
  })(window.location.host);
    App.createDraw = function (x, y) {
    return {
      x:x
      , y:y
      , size:App.ctx.size
      , r:App.ctx.color.r
      , g:App.ctx.color.g
      , b:App.ctx.color.b
      , opacity:App.ctx.opacity
      , nameFromPath:App.PAGE
      , login:App.LOGIN
    };
  }
    App.reDraw = function (touches, ctx){
      //ctx.strokeStyle = 'red';
      //ctx.lineWidth = 1;
      //ctx.shadowOffsetX = 0;
      //ctx.shadowOffsetY = 0;
      //ctx.shadowBlur = 500;
      //ctx.shadowColor = "red";
      //var g = ctx.createLinearGradient(0, 0, touches.x[touches.x.length-1], touches.x[touches.x.length-1]);
        //g.addColorStop(0, 'blue');
        //g.addColorStop(1, 'red');
        //ctx.strokeStyle = g;
      //ctx.strokeStyle = 'red';
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
        , opacity = draw.opacity / 100
        , color = 'rgb(' + r + ',' + g + ',' + b +')'
        , login = draw.login;


      if (opacity < 1) {
            var canvas = (!App.storeCanvas.canvasLogins[login])
                       ? App.storeCanvas.newCanvasCtx(login)
                       : App.storeCanvas.canvasLogins[login];

        if (x !== -100) {
                canvas.ctx.strokeStyle = color;
                canvas.ctx.lineWidth = size;
                canvas.ctx.globalAlpha = opacity;
                canvas.mouseXY.x.push(x);
                canvas.mouseXY.y.push(y);
                canvas.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
                //App.storeByName.login = {};
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
    }
};


/*  	onReady     */


$(document).ready(function(){
  $("#sliderOpacity").slider({
    min:1, max:100, step:1, value:App.DEFAULT_OPACITY, animate:"fast", orientation:"horizontal", range:false,
    slide:function (event, ui) {
      App.ctx.opacity = ui.value;
      App.demoPicker.redrawPicker();
      canvasMove = false;
    },
    start:function(event){
      event.stopImmediatePropagation();
    },
    stop : function(){
      canvasMove = true;
    }
  });
  $("#sliderSize").slider({
    min:1, max:100, step:1, value:App.DEFAULT_SIZE, animate:"fast", orientation:"horizontal", range:false,
    slide:function (event, ui) {
      var differenceWidth = place.offsetWidth/App.canvas.width;
      var size = ui.value;
        //var differenceHeight = place.offsetHeight/App.canvas.height;
      App.ctx.size = size/differenceWidth;
      App.demoPicker.redrawPicker(size);
      canvasMove = false;
    },
    start:function(event){
      event.stopImmediatePropagation();
    },
    stop : function(){
      canvasMove = true;
    }
  });

  //$("#draggable").draggable();

  ColorPicker(document.getElementById('color-picker'),
    function (hex, hsv, rgb) {
      App.ctx.color = rgb;
      App.demoPicker.redrawPicker();
    });


  App.init();
  App.demoPicker.init();
// http://php-zametki.ru/javascript-laboratoriya/66-drag-and-drop-krossbrauzerno.html
  document.onselectstart = function () {
    return false;
  };

  var canvasMove = true;
  var mouseMove = false;



    $("#clear")[0].onclick = function () {
        App.storeCanvas.refresh();
        App.socket.emit('clearAllCanvas', {nameFromPath:App.PAGE});
    };


  var place = $("#placeCanvas")[0];
    $("body")
        .mousedown(function(event){
            if(event.button)return;
            var differenceWidth = place.offsetWidth/App.canvas.width;
            var differenceHeight = place.offsetHeight/App.canvas.height;

            var x = Math.floor((event.pageX - place.offsetLeft)/differenceWidth);
            var y = Math.floor((event.pageY - place.offsetTop)/differenceHeight);

            var draw = App.createDraw(x, y);
            App.socket.emit('drawClick', draw);
            App.drawLine(draw);
            mouseMove = true;
        })
        .mousemove(function(event){
            if(!mouseMove&&canvasMove)return;
            if(event.button)return;
            var differenceWidth = place.offsetWidth/App.canvas.width;
            var differenceHeight = place.offsetHeight/App.canvas.height;

            var x = Math.floor((event.pageX - place.offsetLeft)/differenceWidth);
            var y = Math.floor((event.pageY - place.offsetTop)/differenceHeight);
            var draw = App.createDraw(x, y);
            App.socket.emit('drawClick', draw);
            App.drawLine(draw);

        })
        .mouseup(function(){
            mouseMove = false;
            var draw = App.createDraw(-100, -100);
            App.socket.emit('drawClick', draw);
            App.drawLine(draw);
        });

    App.socket.emit('uploadDraw', {nameFromPath:App.PAGE});
});



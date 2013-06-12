/*
 *
 * Module main
 *
 * Loader core modules and application initialization
 *
 * */

var loader      = require('./loader');
var express = exports.express = loader.express;
exports.fs = loader.fs;
exports.ejs = loader.ejs;
exports.http = loader.http;
exports.mysql = loader.mysql;
exports.Canvas = loader.Canvas;
exports.crypto = loader.crypto;
var socket_io = exports.socket_io = loader.socket_io;

var app_total = require('./vhost/total/app');
var app_mobile = require('./vhost/mobile/app');


const port = 3000;

var app = express();

app.use(express.vhost('mobile.localhost', app_mobile));
app.use(express.vhost('localhost', app_total));
app.set('port', process.env.PORT || port);


var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socket_io.listen(server);
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

exports.io = io;

exports.db          = require('./models/db');
exports.App         = require('./models/canvas_app');
exports.mail        = require('./models/mail');
exports.regular     = require('./tools/regular');
exports.eventApp    = require('./models/event_app');
exports.eventSocket = require('./models/event_socket');






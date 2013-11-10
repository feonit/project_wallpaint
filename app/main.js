/*
 *
 * Module main
 *
 * Loader core modules and appMainlication initialization
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


var appMain = express();
appMain.set('port', process.env.PORT || 3000);

appMain.use(express.vhost('m.*',require('./vhost/mobile/appMobile')));
appMain.use(express.vhost('mobile.*',require('./vhost/mobile/appMobile')));
appMain.use(express.vhost('*', require('./vhost/desctop/appDesctop')));


var server = appMain.listen(appMain.get('port'), function(){
  console.log('Express server listening on port ' + appMain.get('port'));
});

var io = socket_io.listen(server);
/*
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});
*/
exports.io = io;

//exports.db          = require('./models/db');
exports.App         = require('./models/canvas_app');
exports.mail        = require('./models/mail');
exports.regular     = require('./tools/regular');
exports.eventApp    = require('./models/event_app');
exports.eventSocket = require('./models/event_socket');






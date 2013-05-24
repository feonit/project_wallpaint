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
exports.socket_io = loader.socket_io;

var app = express();

require('./config')(app);
require('./routes')(app);

exports.io = require('./server')(app);

app.get('/', function(req, res){
  res.send('hello world');
});

exports.db          = require('./models/db');
exports.App         = require('./models/canvas_app');
exports.mail        = require('./models/mail');
exports.regular     = require('./tools/regular');
exports.eventApp    = require('./models/event_app');
exports.eventSocket = require('./models/event_socket');





/*
db.createNewUser({
  user:'root', name:'admin', surname:'general', password:'admin', email:'root@emailserver.ru', background:'background.png', face:'root.jpg'
});
db.createTableForUser('root');
*/


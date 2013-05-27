/*
 *
 * Module server
 *
 * Module creates a web-server, socket sets and listening to a port
 *
 * */

 module.exports = function(app){

  var main = require('./main');

  var socket_io = main.socket_io;
  //var http = main.http;

  //var server = http.createServer(app);

   var server = app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
   });

  //var s = server.listen(app.get('port'), function(){
  //  console.log('Express server listening on port ' + app.get('port'));
  //});

  // var io = exports.io = socket_io.listen(server);
  // io.configure(function () {
  //   io.set("transports", ["xhr-polling"]);
  //   io.set("polling duration", 10);
  // });

   var io = require('socket.io').listen(server);

  return io
}


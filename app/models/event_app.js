/*
 *
 *  Module event_app
 *
 *  Module is responsible for the events occur when working with a client
 *
 * */

var main = require('../main');

var crypto = main.crypto;
var db = main.db;
var io = main.io;



exports.getHash = function (data) {
  var hash = crypto.createHash('sha1');
  hash.update(data);
  return hash['digest']('hex');
};


/*
 *
 *  Module event_app
 *
 *  Module is responsible for the events occur when working with a client
 *
 * */

var loader = require('../loader');

var crypto = require('crypto')

exports.getHash = function (data) {
  var hash = crypto.createHash('sha1');
  hash.update(data);
  return hash['digest']('hex');
};


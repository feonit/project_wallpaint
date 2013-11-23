/**
 * Сервер десктопный
 */

var app = module.exports = require('express')();

require('../config')(app);
require('./routes')(app);


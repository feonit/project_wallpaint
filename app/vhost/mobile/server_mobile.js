/**
 * Сервер мобильный
 */

var app = module.exports = require('express')();

require('../config')(app);
require('./routes')(app);

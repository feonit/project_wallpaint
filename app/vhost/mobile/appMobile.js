/**
 * Created with JetBrains WebStorm.
 * User: leonid
 * Date: 12.06.13
 * Time: 16:44
 * To change this template use File | Settings | File Templates.
 */


var express = require('../../main').express;

var app = module.exports = express();

require('../config')(app);
require('./routes')(app);

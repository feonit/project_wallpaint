
/**
 * Namespace app
 *
 * */
WALL = {};

/**
 * Loader packages
 *
 * */

WALL.loader = require('./loader');


WALL.app = require('./app').build();
WALL.server = require('./server').run(WALL.app);
WALL.socket = require('./socket').run(WALL.server);

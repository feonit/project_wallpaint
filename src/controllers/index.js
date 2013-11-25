/*
*
*  Controller for the index route
*
* */
var loader = require('./../loader');
var fs = loader.fs;


module.exports = function(req, res){
  
  var path = __dirname + '/../../public/images/background/',
	view = 'index',
	data ={};

	fs.readdir(path, function (err, files){

		if (err) {
			res.end(err);
		}

		data.files = files;
		res.render(view, data);
	})
};
/*
*
*  Controller for the index route
*
* */
var main = require('./../main');
var fs = main.fs;


module.exports = function(req, res){
  
  var path = __dirname + '/../../public/images/background/';
  console.log(1)
  fs.readdir(path, function(err, files){
  if (err){
     res.end(err);
  }
  console.log(2)
    var view = 'index';
    var data ={};
    data.files = files;
    res.render(view, data);
  })
};

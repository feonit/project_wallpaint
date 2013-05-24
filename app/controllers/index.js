/*
*
*  Controller for the index route
*
* */

module.exports = function(req, res){
  var view = 'index';
  res.render(view);
};
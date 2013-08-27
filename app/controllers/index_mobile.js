/*
 *
 *  Controller for the index route
 *
 * */

module.exports = function(req, res){
  var view = 'index_mobile';
  res.render(view);
};
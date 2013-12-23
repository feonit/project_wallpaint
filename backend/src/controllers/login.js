/*
 *
 *  Controller for the login route
 *
 * */

exports.desctop = function(req, res) {
  var view = 'login';
  res.render(view);
};

exports.mobile = function(req, res){
  var view = 'login';
  res.render(view);
};

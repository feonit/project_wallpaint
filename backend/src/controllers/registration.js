/*
 *
 *  Controller for the registration route
 *
 * */

exports.desctop = function(req, res) {
  var view = 'registration';
  res.render(view);
};

exports.mobile = function(req, res){
  var view = 'registration_mobile';
  res.render(view);
};

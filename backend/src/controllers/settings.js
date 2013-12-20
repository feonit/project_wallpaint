/*
 *
 *  Controller for the settings route
 *
 * */

exports.desctop = function(req, res) {
  var view = 'settings';
  res.render(view);
};

exports.mobile = null;

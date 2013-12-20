/*
 *
 *  Controller for the user route
 *
 * */

var main = require('../main');

exports.mobile = function(req, res){
  var view = 'user_mobile';
  var data = {
	  dataUser : 'null',
	  canvasImage : 'null'
  };
  	res.render(view, data);
}

exports.desctop = function(req, res) {
  var view = 'user';
  var data = {
	  dataUser : 'null',
	  canvasImage : 'null'
  };
  var name = req.params.name;


  var db = main.db;
  var App = main.App;


	if(db){
	  db.getDataUser(name, "user", function (dataUser) {
		  if (dataUser[0]) {
			  data.dataUser = dataUser[0];
			  db.getTableData(name, function(dataTable){
				  data.canvasImage = dataToImage(dataTable);
				  res.render(view, data);
			  })
		  }
		  else {
			  res.end("File or user " + name + " wasn't found");
		  }
	  });
	}
	res.render(view, data);


  function dataToImage(data){

    App.init();
    App.canvas = App.createCanvas("default");
    App.ctx = App.canvas.ctx;
    App.store.getData(data);
    App.store.drawStore();

    //console.log(regular.roughSizeOfObject(data));
    //console.log(regular.roughSizeOfObject(canvas.toDataURL()));
    return App.canvas.toDataURL();
  }
};

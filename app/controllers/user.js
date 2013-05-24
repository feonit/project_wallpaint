/*
 *
 *  Controller for the user route
 *
 * */

var main = require('../main');

module.exports = function(req, res) {
  var view = 'user';
  var data = {};
  var name = req.params.name;


  var db = main.db;
  var App = main.App;


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

  function dataToImage(data){

    App.init();
    var canvas = App.canvas = App.storeCanvas.newCanvasCtx("default");
    var ctx = App.ctx = App.canvas.ctx;
    App.store.getData(data);
    App.store.drawStore();

    ctx.fillStyle = "#00F";
    ctx.strokeStyle = "#F00";
    ctx.textBaseline = "bottom";
    ctx.font = "200pt Arial";
    ctx.fillText("Feonit", 200, 200);
    //console.log(regular.roughSizeOfObject(data));
    //console.log(regular.roughSizeOfObject(canvas.toDataURL()));
    return canvas.toDataURL();
  }
};
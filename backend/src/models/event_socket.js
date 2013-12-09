module.exports = new function () {

	var db = require('./db');

	/**
	 * Новая контрольная точка
	 *
	 * @this {Object} socket module
	 * */

	this.drawClick = function (data) {
		var that = this;

		that.get('pageName', function (err, pageName) {

			that.broadcast.to(pageName).emit('draw', data); //emitDraw

			if (db) {
				db.addDrawToTable(pageName, data);
			}
		});
	};

	/**
	 * Очищение холста
	 *
	 * */

	 this.clearAllCanvas = function () {
/*		this.get('pageName', function (err, pageName) {
			if (err) throw new Error(err);
			if (db) {
				db.clearTableForUser(pageName);
			}
			io.sockets.emit('clearAllCanvas', pageName);
		});*/
	};

	/**
	 * Поиск юзера по базе
	 *
	 * Такие вещи нужно переделывать на AJAX
	 *
	 * */

	this.searchUser = function (data) {
		var self = this;
		var user = data['user'];
		if (db){
			db.getDataUser(user, "user", function (res) {
				var answer = !!res[0];
				var enumPage = {
					'registration':1
					,'registration_rezult':2
					,'settings':3
					,'index':4
					, 'user':5
					, 'login':6
				};
				answer = answer || !!enumPage[user];
				self.emit("searchUserAnswer", {answer: answer});
			})
		}
	};

	/**
	 * Поиск мыла
	 *
	 * Такие вещи нужно переделывать на AJAX
	 *
	 * */

	this.searchEmail = function (data) {
		var self = this;
		var email = data['email'];
		if (db){
			db.getDataUser(email, "email", function (res) {
				var answer = !!res[0]
				self.emit("searchEmailAnswer", {answer: answer});
			})
		}

	};


	/**
	 * Подгрузить точки для холста
	 *
	 * @deprecated
	 *
	 * */

	this.uploadDraw = function (data) {
		var pageName = data.nameFromPath;

		if (db){
			db.getTableData(pageName, function (res) {
				if (res) {
					that.set('pageName', pageName, function () {
						that.join(pageName);
					});  //SET pageName for socket
					//socket.emit('uploadStore', res);
				}
			});
		}
	}


};
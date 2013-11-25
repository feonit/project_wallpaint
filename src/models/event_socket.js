module.exports = new function () {

	var db = require('./db');

	/**
	 * Установка имени для страницы
	 *
	 * */

	 this.setPageName = function (pageName) {
		this.join(pageName);
		this.set('pageName', pageName, function () {
			//SET pageName for socket
		});
	};


	/**
	 * Новая контрольная точка
	 *
	 * */

	this.drawClick = function (data) {
		var self = this;
		self.get('pageName', function (err, pageName) {
			self.broadcast.to(pageName).emit('draw', data); //emitDraw

			var post = {
				x:data['x'], y:data['y'], size:data['size'], r:data['r'], g:data['g'], b:data['b'], opacity:data['opacity'], login:data['login']
			};
			if (db) {
				db.addDrawToTable(pageName, post);
			}
		});
	};

	/**
	 * Очищение холста
	 *
	 * */

	 this.clearAllCanvas = function () {
		this.get('pageName', function (err, pageName) {
			if (err) throw new Error(err);
			if (db) {
				db.clearTableForUser(pageName);
			}
			io.sockets.emit('clearAllCanvas', pageName);
		});
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
		var self = this;
		var pageName = data.nameFromPath;

		if (db){
			db.getTableData(pageName, function (res) {
				if (res) {
					self.set('pageName', pageName, function () {
						self.join(pageName);
					});  //SET pageName for socket
					//socket.emit('uploadStore', res);
				}
			});
		}
	}


};
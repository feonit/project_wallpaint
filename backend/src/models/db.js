/*
 *
 *  Module db
 *
 *  Initialization module database and data access components
 *
 * */

module.exports = new function() {

	var mysql, server, connections, connection, that;

	mysql = require('mysql');

	connections = [
		{
			host:"localhost"
			,user:"root"
			,password:"pe104767"
			,database:"test"
		},
		{
			host:"db4free.net"
			,user:"nastene"
			,password:"nastene"
			,database:"nastene"
		}//http://db4free.net/d4f_apply.php
	];

	server = connections[1];

	connection = mysql.createConnection({
		host:		server.host,
		port:		'3306',
		user:		server.user,
		password:	server.password,
		db:			server.database,
		charset:	'UTF8_GENERAL_CI',	//Default
		typeCast:'	false'       		//Default Determines if column values should be converted to native JavaScript types
	});

	/**
	 *  bind events
	 * */

	connection.on('error', function (error) 	{console.log('SOMETHING IS ERROR' + error);})
		.on('fields', function (fields) 	{console.log('SOMETHING IS FIELDS' + fields);})
		.on('result', function (result) 	{console.log('SOMETHING IS RESULT' + result);});



	/** Соединение с выбранным сервером базы данных
	 *
	 * @param {Number} connection выбранное соединение
	 * @return {Object} status of connection
	 * */

	this.connectionToServer = function (connection){
		return connection.connect(function (err) {
			if (!err) console.log('mysql connected');
			else console.log('mysql unconected'+ err);
		});
	};



	this.createTableUsers = function () {
		var sql = "CREATE TABLE IF NOT EXISTS `"+ server.database +"`.`users` ("
			+ "id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,"
			+ "user CHAR(30),"
			+ "name CHAR(30),"
			+ "surname CHAR(30),"
			+ "password CHAR(30),"
			+ "email CHAR(30),"
			+ "background CHAR(30),"
			+ "face CHAR(30)"
			+ ");";
		return this.query(sql);
	};

	this.createConfirmUsers = function () {
		var sql = "CREATE TABLE IF NOT EXISTS `"+ server.database +"`.`confirm`("
			+ "id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,"
			+ "hash CHAR(100) NOT NULL,"
			+ "name CHAR(30) NOT NULL,"
			+ "email CHAR(30) NOT NULL,"
			+ "password CHAR(30) NOT NULL,"
			+ "user CHAR(30) NOT NULL"
			+ ");";
		return this.query(sql);
	};

	this.setUtf8 = function(){
		connection.query("SET NAMES 'utf8'");
		connection.query("SET CHARACTER SET 'utf8'");
		connection.query("SET SESSION collation_connection = 'utf8_general_ci'");
		connection.query("set character_set_database='utf8'");
		connection.query("set character_set_server='utf8'");
		connection.query("set character_set_client='utf8'");
		connection.query("set character_set_results='utf8'");
	};


	this.initDataBase = function (){
		this.setUtf8();
		this.createTableUsers();
		this.createConfirmUsers();
		return true;
	};


	this.query = function (sql, post, callback) {
		var errRes = function (err, res){
			if (!err) {
				if (callback) {
					return callback(res);
				}
				return res;
			} else {
				return console.log(sql + err);
			}
		};
		return connection.query(sql, post, errRes);
	};

	that = this;

	this.addConfirm=function (post) {
		return that.query("INSERT INTO "+ database +".confirm SET ?", post);
	};
	this.getConfirm=function (hash, callback) {
		return that.query("SELECT * FROM "+ database +".confirm WHERE hash = '" + hash + "'", 0, callback);
	};
	this.createNewUser=function (data) {
		var success = false;
		this.getDataUser(data.user, "user", function (res) {
			if (!res.length) {
				var post = {
					user:data['user'] || 'default',
					name:data['name'] || 'default',
					surname:data['surname'] || 'default',
					password:data['password'] || 'default',
					email:data['email'] || 'default',
					background:data['background'] || 'default',
					face:data['face'] || 'default'
				};
				success = true;
				return this.query('INSERT INTO '+ server.database +'.users SET ?;', post);
			}
			return res;
		});
		return success;
	};
	this.createTableForUser=function (user) {
		var sql = "CREATE TABLE IF NOT EXISTS `"+ server.database +"`.`" + user + "` ( "
			+ "x INTEGER NOT NULL,"
			+ "y INTEGER NOT NULL,"
			+ "size INTEGER NOT NULL,"
			+ "r INTEGER,"
			+ "g INTEGER,"
			+ "b INTEGER,"
			+ "opacity INTEGER,"
			+ "login CHAR(30)"
			+ ");";
		return that.query(sql);
	};
	this.getDataUser=function (data, dataBy, callback) {
		var sql = "SELECT * FROM "+ server.database +".users WHERE " + dataBy + " = '" + data + "';";
		return that.query(sql, 0, callback);
	};
	this.clearTableForUser=function (user) {
		var sql = "TRUNCATE TABLE "+ server.database +"." + user + ";";
		return that.query(sql);
	};
	this.getTableData=function (user, func) {
		var sql = "SELECT * FROM "+ server.database +"." + user + ";";
		return that.query(sql, 0, func);
	};
	this.addDrawToTable=function (user, post) {
		var sql = "INSERT INTO "+ server.database +"." + user + " SET ?";
		return that.query(sql, post);
	};

	this.connectionToServer(connection);
	this.initDataBase();



	this.createNewUser({
		user:'feonit', name:'admin', surname:'general', password:'admin', email:'root@emailserver.ru', background:'background.png', face:'root.jpg'
	});
	this.createTableForUser('feonit');
};


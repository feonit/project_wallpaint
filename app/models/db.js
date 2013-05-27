/*
 *
 *  Module db
 *
 *  Initialization module database and data access components
 *
 * */

( function(){

  var mysql = require('../main').mysql;


  var connections = [
    {
      host:"localhost"
      ,user:"root"
      ,password:"pe104767"
      ,database:"test"
    },
    {
      host:"sql2.freemysqlhosting.net"
      ,user:"sql26865"
      ,password:"zH4%iV1!"
      ,database:"sql26865"
    },
    {
      host:"mysql4.000webhost.com"
      ,user:"a8537295_feonit"
      ,password:"pe104767"
      ,database:"a8537295_feonit"
    }
  ];

  var server = connections[0];

    var host = server.host;
    var user = server.user;
    var password = server.password;
    var database = server.database;


  var connection = mysql.createConnection({
    host:host,
    port:'3306', //Default
    user:user,
    password:password,
    db:database,
    charset:'UTF8_GENERAL_CI', //Default
    typeCast:'false'       //Default Determines if column values should be converted to native JavaScript types
  })
    .on('error', function (err) {
      echo('SOMETHING IS ERROR' + err);
    })
    .on('fields', function (fiel) {
      echo('SOMETHING IS FIELDS' + fiel);
    })
    .on('result', function (res) {
      echo('SOMETHING IS RESULT' + res);
    });

  var connectionToServer = function (){
    var statusConnect = connection.connect(function (err) {
      if (!err) {
        echo ('mysql connected');
      }else error('mysql unconected'+ err)
    });
    return statusConnect;
  }

  function initDataBase(){
      connection.query("SET NAMES 'utf8'");
      connection.query("SET CHARACTER SET 'utf8'");
      connection.query("SET SESSION collation_connection = 'utf8_general_ci'");
      connection.query("set character_set_database='utf8'");
      connection.query("set character_set_server='utf8'");
      connection.query("set character_set_client='utf8'");
      connection.query("set character_set_results='utf8'");

      (function createTableUsers() {
          var sql = "CREATE TABLE IF NOT EXISTS `"+ database +"`.`users` ("
              + "id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,"
              + "user CHAR(30),"
              + "name CHAR(30),"
              + "surname CHAR(30),"
              + "password CHAR(30),"
              + "email CHAR(30),"
              + "background CHAR(30),"
              + "face CHAR(30)"
              + ");";
          return query(sql);
      })();
      (function createConfirmUsers() {
          var sql = "CREATE TABLE IF NOT EXISTS `"+ database +"`.`confirm`("
              + "id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,"
              + "hash CHAR(100) NOT NULL,"
              + "name CHAR(30) NOT NULL,"
              + "email CHAR(30) NOT NULL,"
              + "password CHAR(30) NOT NULL,"
              + "user CHAR(30) NOT NULL"
              + ");";
          return query(sql);
      })();
    return true;
  }


  function query(sql, post, callback) {
    var errRes = function (err, res){
      if (!err) {
        if (callback) {
          return callback(res);
        }
        return res;
      } else {
        return error(sql + err);
      }
    };
    return connection.query(sql, post, errRes);
  }

  exports.addConfirm=function (post) {
      /* confirm = post{
       * hash
       * user
       * email
       * }
       * */
      var sql = "INSERT INTO "+ database +".confirm SET ?";
      return query(sql, post);
    };
  exports.getConfirm=function (hash, callback) {
      var sql = "SELECT * FROM "+ database +".confirm WHERE hash = '" + hash + "'";
      return query(sql, 0, callback);
    };
  exports.createNewUser=function (data) {
      var success = false;
      //var data = data || {};
      this.getDataUser(data.user, "user", function (res) {
        if (!res.length) {
          var post = {
            user:data['user'] || 'default', name:data['name'] || 'default', surname:data['surname'] || 'default', password:data['password'] || 'default', email:data['email'] || 'default', background:data['background'] || 'default', face:data['face'] || 'default'
          };
          var sql = 'INSERT INTO '+ database +'.users SET ?;';
          success = true;
          return query(sql, post);
        }
        return res;
      });
      return success;
    };
  exports.createTableForUser=function (user) {
      var sql = "CREATE TABLE IF NOT EXISTS `"+ database +"`.`" + user + "` ( "
        + "x INTEGER NOT NULL,"
        + "y INTEGER NOT NULL,"
        + "size INTEGER NOT NULL,"
        + "r INTEGER,"
        + "g INTEGER,"
        + "b INTEGER,"
        + "opacity INTEGER,"
        + "login CHAR(30)"
        + ");";
      return query(sql);
    };
  exports.getDataUser=function (data, dataBy, callback) {
      var sql = "SELECT * FROM "+ database +".users WHERE " + dataBy + " = '" + data + "';";
      return query(sql, 0, callback);
    };
  exports.clearTableForUser=function (user) {
      var sql = "TRUNCATE TABLE "+ database +"." + user + ";";
      return query(sql);
    };
  exports.getTableData=function (user, func) {
      var sql = "SELECT * FROM "+ database +"." + user + ";";
      return query(sql, 0, func);
    };
  exports.addDrawToTable=function (user, post) {
      var sql = "INSERT INTO "+ database +"." + user + " SET ?";
      return query(sql, post);
    };

  connectionToServer();
  initDataBase();
})();


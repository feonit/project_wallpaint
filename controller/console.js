(function(exports){
  exports.echo = function (str) {  console.log("[ log ] " + str);};
  exports.warn = function (str) {  console.warn("[ warn ] " + str);};
  exports.error = function (str) {  console.error("[ error ] " + str);};
  exports.read = function (obj){  for (var k in obj) {    if (obj.hasOwnProperty(k)){      echo("[ read ] " + k + " : " + obj[k])    }  }};
})(global);
(function ($,io) {

  var permitUser = undefined;
  var permitEmail = undefined;

  function log(str) {
      console.log("[ log ] " + str);
  }
  function warn(str) {
      console.warn("[ warn ] " + str);
  }
  function error(str) {
      console.error("[ error ] " + str);
  }
  function read (obj){  for (var k in obj) {    if (obj.hasOwnProperty(k)){      log("[ read ] " + k + " : " + obj[k])    }  }};

  var regExp = {
      name :  (/^[A-Za-z]{1,30}$/i)
      ,email : (/^([a-z0-9_-]+.)*[a-z0-9_-]+@([a-z0-9][a-z0-9-]*[a-z0-9].)+\.[a-z]{2,4}$/i)
      ,password : (/^[A-Za-z]{6,30}$/i)
      ,user : (/^[A-Za-z]{1,30}$/i)
  }



  $(document).ready(function() {

    $(".prompt p").toggleClass("hidden");


        $(".prompt input").bind("click", function(){
            setStat(this, "source");
        });

        $("#name")[0].onkeyup = function(){
          if(event.keyCode==9)return setStat(this, "source");
          if(regExp.name.test(this.value)){
            setStat(this, "ok");
          }else{
            setStat(this, "error");
          }
        }
        $("#email")[0].onkeyup = function(event){
          if(event.keyCode==9)return setStat(this, "source");
          if(regExp.email.test(this.value)){
            setStat(this, "ok");
            socket.emit('searchEmail', {email:this.value});
          }else{
            setStat(this, "error");
          }
        }
        $("#password")[0].onkeyup = function(){
          if(event.keyCode==9)return setStat(this, "source");
          if(regExp.password.test(this.value)){
            setStat(this, "ok");
          }else{
            setStat(this, "error");
          }
        }
        $("#user")[0].onkeyup = function(){
          if(event.keyCode==9)return setStat(this, "source");
          if(regExp.user.test(this.value)){
            setStat(this, "ok");
            socket.emit('searchUser', {user:this.value});
          }else{
            setStat(this, "error");
          }
        }
/*
        kk = function(){
            var reg = /\W/;

            if(regExp.isValidName(this.value)){
                socket.emit('searchUser', {user:this.value});
            }
        }
        jj.onkeyup = function(){
            var reg = /[^A-Za-z@0-9-.]/;
            if(reg.test(this.value)){
                this.value = this.value.replace(reg, '');
            }
            var reg = /.{30,}$/;
            if(reg.test(this.value)){
                this.value = this.value.replace(reg, '');
            }
            if (regExp.isValidEmail(this.value)){
                socket.emit('searchEmail', {email:this.value});
            }
        }
        jl.onclick = function(){

          $.cookie("user", bUser.value);
          $.cookie("email", bEmail.value);
        }
    */
    /*
     if(permitUser && permitEmail){
     var data = {
     user : bUser.value
     , email : bEmail.value
     , host : window.location.host
     };
     log("create" + data);
     socket.emit('addUser', data);
     permitUser =undefined;
     permitEmail =undefined;
     }
     */
    });

    var socket = io.connect(window.location.host);

    socket.on('searchUserAnswer', function(data){
        permitUser = !data.answer;
        var input = $("#user")[0];
        (data.answer)?setStat(input, "error", "exist"):setStat(input, "ok");
    });
    socket.on('searchEmailAnswer', function(data){
        permitEmail = !data.answer;
      var input = $("#email")[0];
      (data.answer)?setStat(input, "error", "exist"):setStat(input, "ok");
    });
    socket.on("responseForAddUser", function(err){
      var response = undefined;
        switch(err) {
            case 0: {
                response = "Вам на почту было отправлено писмо с инструкцией для завершения регистрации";
                break;
            }
            case 1: {
                response = "Потеря данных";
                break;
            }
            case 2: {
                response = "Имя не корректно";
                break;
            }
            case 3: {
                response = "Емаил не корректен";
                break;
            }
            case 4: {
                response = "Пользователь с таким именем уже есть";
                break;
            }
            case 5: {
                response = "Такой емаил уже был зарегистрирован";
                break;
            }
            default: {
                response = "Сервер не отвечает";
                break;
            }
        }
      $("#registration")[0].innerHTML = response; //todo place for answer
        var bUser = $("#user")[0];
        var bEmail = $("#email")[0];

        bUser.value = '';
        bEmail.value = '';
    });

})($,io);

function setStat(input, stat, exist){
  var field = $(input.parentNode);
  var p = (exist)?"p."+stat+"."+exist : "p."+stat;
  if(stat == "source")$(input).unbind("click");
  $("p",field).addClass("hidden");
  $(p, field).eq(0).removeClass("hidden");
}
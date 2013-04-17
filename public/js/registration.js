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
    var regExp = {
        isValidEmail : function(email) {
            return (/^([a-z0-9_-]+.)*[a-z0-9_-]+@([a-z0-9][a-z0-9-]*[a-z0-9].)+\.[a-z]{2,4}$/i).test(email);
        },
        isValidName : function(user) {
            return (/^[A-Za-z]{3,15}$/i).test(user);
        }
    }

  $(document).ready(function() {

    $(".prompt p").toggleClass("hidden");


        $(".prompt input").bind("click", function(){
            $("p.source",$(this.parentNode)).removeClass("hidden")
        });

        $(".prompt.user input")[0].onkeyup = function(){
          log(this.value)
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
        var bUser = $("#user");
        var check = (data.answer) ? "К сожалению, это имя уже занято" : "Имя свободно";
        bUser.tooltip({ content: check ,position: { my: "left+15 center", at: "right center" } });
        bUser.tooltip('open');
      $( document ).tooltip();
    });
    socket.on('searchEmailAnswer', function(data){
        permitEmail = !data.answer;
        var bEmail = $("#email");
        var check = (data.answer) ? "К сожалению, этот емаил уже зарегистрирован" : "Емаил свободен";
        bEmail.tooltip({ content: check ,position: { my: "left+15 center", at: "right center" }});
        bEmail.tooltip('open');
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


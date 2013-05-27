(function ($, io, window) {

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
      name :  (/^[A-Za-zА-Яа-я ]{1,30}$/i)
      ,email : (/^([a-z0-9_-]+.)*[a-z0-9_-]+@([a-z0-9][a-z0-9-]*[a-z0-9].)+\.[a-z]{2,4}$/i)
      ,password : (/^[A-Za-zА-Яа-я0-9]{6,30}$/i)
      ,user : (/^[A-Za-z]{1,30}$/i)
  }

  var permitUser =  true;
  var permitEmail =  true;

  $(document).ready(function() {
    var bName = $("#name")[0]
        , bEmail = $("#email")[0]
        , bPassword = $("#password")[0]
        , bUser = $("#user")[0]
        , bPrompts = $(".prompt p")
        , bInputs = $(".prompt input")
        , dForm = $("form")
        , bAnswer = $("#answer")[0];
      var socket = io.connect(window.location.host);


      bPrompts.toggleClass("hidden");
      bInputs.each(function(){
          this.onclick = function(){
              setStat(this, "source");
          };
          this.onblur = function(){
              this.onkeyup();
          }
          this.onkeydown = function(){
              setStat(this, "check");
          }
      });


      bName.onkeyup = function(event){
          if(event){
              if(event.keyCode==9)return setStat(this, "source");
          }
          var node = this;
          var handler = function (){
              var input = node;
              if(regExp.name.test(input.value)){
                  setStat(input, "ok");
              }else{
                  setStat(input, "error");
              }
          }
          window.setTimeout(handler, 1000);
          return false;
        }
      bEmail.onkeyup = function(event){
          if(event){
              if(event.keyCode==9)return setStat(this, "source");
          }
          var node = this;
          //event.stopImmediatePropagation();
          var handler = function (){
              var input = node;
              setStat(input, "ok");
              if(regExp.email.test(input.value)){
                  socket.emit('searchEmail', {email:input.value});
              }else{
                  setStat(input, "error");
              }
          }
          window.setTimeout(handler, 2000);
          return false;
        }
      bPassword.onkeyup = function(event){
          if(event){
              if(event.keyCode==9)return setStat(this, "source");
          }
          var node = this;
          var handler = function (){
              var input = node;
              if(regExp.password.test(input.value)){
                  setStat(input, "ok");
              }else{
                  setStat(input, "error");
              }
          }
          window.setTimeout(handler, 1500);
          return false;
        }
      bUser.onkeyup = function(event){
          if(event){
              if(event.keyCode==9)return setStat(this, "source");
          }
          var node = this;
          var handler = function (){
              var input = node;
              if(regExp.user.test(input.value)){
                  setStat(this, "ok");
                  socket.emit('searchUser', {user:input.value});
              }else{
                  setStat(input, "error");
              }
          }
          clearTimeout(this.timeout_id);
          this.timeout_id = window.setTimeout(handler, 2500);

          return false;
        }
      dForm.submit(function(){
          if(regExp.name.test(bName.value)
           &&regExp.email.test(bEmail.value)
           &&regExp.password.test(bPassword.value)
           &&regExp.user.test(bUser.value)
           &&permitUser
           &&permitEmail){
              return true;//разрешить отправку
          }else{
              return false;
          }
      });

      if($.cookie('user')){
          bUser.value = $.cookie('user');
          setStat(bUser, "check");
          bUser.onkeyup();
      }
      if($.cookie('email')){
          bEmail.value = $.cookie('email');
          setStat(bEmail, "check");
          bEmail.onkeyup();
      }

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
          var response = err || "Сервер не отвечает";
          bAnswer.innerHTML = response;
      });
    });
})($,io,window);

function setStat(input, stat, exist){
  var field = $(input.parentNode);
  var p = (exist)?"p."+stat+"."+exist : "p."+stat;
  if(stat == "source")$(input).unbind("click");
  $("p",field).addClass("hidden");
  $(p, field).eq(0).removeClass("hidden");
}
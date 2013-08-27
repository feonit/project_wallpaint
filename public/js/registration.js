//(function ($, io) {

  $(function() {

    var regExp = {
      name :  (/^[A-Za-zА-Яа-я ]{2,30}$/i)
      ,email : (/^([a-z0-9_-]+.)*[a-z0-9_-]+@([a-z0-9][a-z0-9-]*[a-z0-9].)+\.[a-z]{2,4}$/i)
      ,password : (/^[A-Za-zА-Яа-я0-9]{6,30}$/i)
      ,user : (/^[A-Za-z]{1,30}$/i)
    }
    var permitUser =  true;
    var permitEmail =  true;

    var bAnswer = $("#answer")[0]   //todo
    var bInputs = $("input");
    var bUser = $("#user");
    var bEmail = $("#email");

    var host = (location.host.search('localhost')!==-1)
        ? "127.0.0.1:"+location.port
        : location.host;
    var socket = io.connect(host);

    /**
     * socket init
     *
     * */

    function recordResUser(data){
      permitUser = !data.answer;
      (data.answer)?setStatus.call(bUser, "engaged"):setStatus.call(bUser, "ok");
    }
    function recordResEmail(data){
      permitEmail = !data.answer;
      (data.answer)?setStatus.call(bEmail, "engaged"):setStatus.call(bEmail, "ok");
    }
    function registrationResult(err){
      var response = err || "Сервер не отвечает";
      bAnswer.innerHTML = response;
    }

    socket.on('searchUserAnswer', recordResUser);
    socket.on('searchEmailAnswer', recordResEmail);
    socket.on("responseForAddUser", registrationResult);

    /**
     * cookie init
     *
     * */

    if($.cookie('user')){
      bUser.value = $.cookie('user');
      setStatus.call(bUser, "check");
      bUser.onkeyup();
    }
    if($.cookie('email')){
      bEmail.value = $.cookie('email');
      setStatus.call(bEmail, "check");
      bEmail.onkeyup();
    }

    /**
     * EventListener init
     *
     * */

    function addEventListener(element, event, handler){
      if (element.addEventListener)
        element.addEventListener(event, handler, false)
      else if (element.attachEvent)
        element.addEventListener("on" + event, handler) //здесь this ссылается на window , поэтому цель события определяется в handler
    }
    function removeEventListener(element, event, handler){
      if (element.removeEventListener)
        element.removeEventListener(event, handler, false)   //what is true  ; try in IE
      else if (element.detachEvent)
        element.detachEvent("on" + event, handler)
    }

    /**
     * DOM function init
     *
     * */

    function handleFirstMsg(e){
      var e = e || window.event;
      var element = e.target || e.srcElement; // IE8-
      setStatus.call(element, "source");
      removeEventListener(element, "click", handleFirstMsg);
    }


    function checkAllFields(){
      var allow = permitUser && permitEmail;
      bInputs.each(function(){
        allow = allow && isValid.call(this);
      });
    }


    function hold(func, timer){
      return function(){
        var self = this;
        if(this[func.name]) clearTimeout(this[func.name]);
        this[func.name] = setTimeout(function(){  //set timers in func for only obj.id
          func.call(self);
        }, timer);
      }
    };

    function setStatus(status){
      var mes = $('#'+this.attr('id')+'-messages')
        , msg = mes.data(status)
      mes.text(msg);
    }

    function displayStatusCheck(){
      displayStatusCheck.name="displayStatusCheck";
      setStatus.call(this, "check");
    };

    function handleValidated(){
      handleValidated.name="handleValidated";
      console.log('валидация')
      switch (this.type){   //проверить
        case "text":
          this.isValid() ? setStatus.call(this, "ok") : setStatus.call(this, "error");
          break;
        case "email":
          this.isValid() ? socket.emit('searchEmail', {email:this.value}) : setStatus.call(this, "error");
          break;
        case "password":
          if(this.isValid()){
            setStatus.call(this, "ok");
            socket.emit('searchUser', {user:this.value});
          }else{
            setStatus.call(this, "error");
          };
          break;
        default: console.log('no have type');
      }
    }


    bInputs.each(function(){
       if(this.type==="submit"){
         addEventListener(this, "submit", checkAllFields);
       }
       else{
         addEventListener(this, "click", handleFirstMsg);
         addEventListener(this, "keyup", function(e){
           var e = e || window.event;
           //if(event.keyCode==9) return false;    //todo
           hold(displayStatusCheck,500).call(this);
           //displayStatusCheck.call(this);
           hold(handleValidated,2000).call(this);
         });         //addEventListener(this, "blur", )
         addEventListener(this, "keydown", function(){console.log('keydown')})

         this.isValid = function(){                                      //нужно наследовать этот общий метод для кнопок
           if(regExp.hasOwnProperty(this.id)){
             return regExp[this.id].test(this.value);
           }
         }
       }
    });

  });
//})($,io);
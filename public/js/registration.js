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
     * DOM function init
     *
     * */

    function handleFirstMsg(e){
      var e = e || window.event;
      var element = e.target || e.srcElement; // IE8-
      element = $(element);
      setStatus.call(element, "source");
    }


    function checkAllFields(){
      var allow = permitUser && permitEmail;
      bInputs.each(function(){
        allow = allow && isValid(this);
      });
    }

    function isValid(self){
      if(self.jquery){
        if(regExp.hasOwnProperty(self.attr('id'))){
          return regExp[self.attr('id')].test(self.val());
        }else throw new Error('no have reqexp for this element')
      } else throw new Error('jquery pls')
    }


    function setStatus(status){
      if(this.jquery){
        var mes = $('#'+this.attr('id')+'-messages')
          , msg = mes.data(status)
        mes.text(msg);
      } else {
        throw new Error('jquery pls');
        //console.log(setStatus.caller)
      }
    }


    function displayStatusCheck(){
      setStatus.call(this, "check");
    };

    function handleValidated(){
      if(this.jquery){
        console.log('валидация')
        switch (this.attr('type')){   //проверить
          case "text":
            isValid(this) ? setStatus.call(this, "ok") : setStatus.call(this, "error");
            break;
          case "email":
            isValid(this) ? socket.emit('searchEmail', {email:this.val()}) : setStatus.call(this, "error");
            break;
          case "password":
            if(isValid(this)){
              setStatus.call(this, "ok");
              socket.emit('searchUser', {user:this.value});
            }else{
              setStatus.call(this, "error");
            };
            break;
          default: console.log('no have type');
        }
      } else throw new Error('jquery pls')
    }



    bInputs.each(function(){
      var self = $(this);
      if(self.attr('type')==="submit"){
        self.bind("submit", checkAllFields);
      }else{
        self.one("click", handleFirstMsg);
        self.bind("keyup", function(){
          self.clearQueue().queue(function(){
            setTimeout(function(){console.log(1)},1000)
            self.dequeue();
          }).queue(function(){
              console.log(2);
              displayStatusCheck.call(self);
              self.dequeue();
            }).queue(function(){
                handleValidated.call(self);
            });
        });
      }
    })


  });
//})($,io);
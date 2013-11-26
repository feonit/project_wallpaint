//(function ($, io) {

  $(function() {

    var regExp = {
      name :  (/^[A-Za-zА-Яа-я ]{2,30}$/i)
      ,email : (/^([a-z0-9_-]+.)*[a-z0-9_-]+@([a-z0-9][a-z0-9-]*[a-z0-9].)+\.[a-z]{2,4}$/i)
      ,password : (/^[A-Za-zА-Яа-я0-9]{6,30}$/i)
      ,user : (/^[A-Za-zА-Яа-я0-9]{1,30}$/i)
    }

        
    var bAnswer = $("#answer");   //todo
    var bInputs = $("input");
    var bUser = $("#user");
    var bEmail = $("#email");
    var bSubmit = $("#submit");

    var host = (location.host.search('localhost')!==-1)
        ? "127.0.0.1:"+location.port
        : location.host;
    var socket = io.connect(host);
    
    var permitUser =  false;
    var permitEmail =  false;
    
    function checkAllFields(){
      var allow = permitUser && permitEmail;
      bInputs.each(function(){
        allow = allow && isValid.call(this);
      });

      if (!allow) bAnswer.fadeIn().text('Необходимо исправить данные');
      return allow;
    }

    /**
     * socket init
     *
     * */

    function recordResUser(data){
      permitUser = !data.answer;
      (data.answer)?displayStatus.call(bUser, "engaged"):displayStatus.call(bUser, "ok");
    }
    function recordResEmail(data){
      permitEmail = !data.answer;
      (data.answer)?displayStatus.call(bEmail, "engaged"):displayStatus.call(bEmail, "ok");
    }

    socket.on('searchUserAnswer', recordResUser);
    socket.on('searchEmailAnswer', recordResEmail);


    /**
     * cookie init
     *
     * */

    if($.cookie('user')){
      bUser.val($.cookie('user'));
      displayStatus.call(bUser, "check");
      handleKeyActive.call(bUser);
    }
    if($.cookie('email')){
      bEmail.val($.cookie('email'));
      displayStatus.call(bEmail, "check");
      handleKeyActive.call(bEmail);
    }

    /**
     * DOM function init
     *
     * */

    function handleFirstMsg(e){
      var e = e || window.event;
      var element = e.target || e.srcElement; // IE8-
      if(!$(element).val())displayStatus.call($(element), "source");
    }




    function isValid(){
      if(regExp.hasOwnProperty($(this).attr('id'))){
        return regExp[$(this).attr('id')].test($(this).val());
      }else throw new Error('no have reqexp for this element');
    }


    function displayStatus(status){
      if(this.jquery){
        var mes = $('#'+this.attr('id')+'-messages')
          , msg = mes.data(status);
        mes.html(msg);
        mes.removeClass('ok check error engaged').addClass(status)
      } else {
        throw new Error('jquery pls');
        //console.log(displayStatus.caller)
      }
    }


    function displayStatusCheck(){
      displayStatus.call(this, "check");
    };

    function validated(){
      if(this.jquery){
        console.log('валидация')
        switch (this.attr('id')){
          case "email":
            isValid.call(this) ? socket.emit('searchEmail', {email:this.val()}) 
                               : displayStatus.call(this, "error");
                                 break;
          case "user":
            isValid.call(this) ? socket.emit('searchUser', {user:this.val()})
                               : displayStatus.call(this, "error");
                                 break;
          default:                     //password and name
            isValid.call(this) ? displayStatus.call(this, "ok") 
                               : displayStatus.call(this, "error");
                                 break;
        }
      } else throw new Error('jquery pls')
    }

      function handleKeyActive(){
        displayStatusCheck.call($(this));
        $(this).delay(500);
        $(this).queue(function (){
          if($(this).queue().length>1){
            $(this).clearQueue();
            $(this).delay(500);
            $(this).queue(function(){
              handleKeyActive.call(this);
            });
          }
          else {
            validated.call($(this));
          }
          $(this).dequeue();
        });
      }

    bInputs.each(function(){
      $(this).one("focus", handleFirstMsg);
      $(this).bind("input", handleKeyActive); //mb to do for IE str 518
    });
    
    $('form').bind("submit", checkAllFields);



  });
//})($,io);

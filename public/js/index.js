var submit = $('#submit')[0]
  , user = $('#user')[0]
  , email = $('#email')[0]

submit.onclick= function(){
  $.cookie('user', user.value);
  $.cookie('email', email.value);
}


/*
 *
 *  Module mail
 *
 *  Module to send the message
 *
 * */



var mail = require("nodemailer");
var db = require('./db')


var transport = mail.createTransport("SMTP", {
  service:"Gmail",
  auth:{
    user:"feonitu@gmail.com",
    pass:""
  }
});


//todo close transport

exports.sendMassage = function (mailOptions) {
  transport.sendMail(mailOptions, function (err, res) {
    if (err) 
      throw new Error(err);
    else 
      echo("Message sent: " + res.message);
    //transport.close(); // shut down the connection pool, no more messages
  })
};

exports.createMassageRegistration = function(host, email, user, hash){
  var href = "http://" + host + "/registration_continue?user=" + user + "&email=" + email + "&hash=" + hash;
  return {
    from:"micro-site.net>",
    to:email,
    subject:"Регистрация на сайте",
    text:"Продолжение",
    html:
      "<h2>Dear "+user+"! Для завершения регистрации пройдите по ссылке "
        +"расположенной ниже, это нужно чтобы удостовериться,"
        +"что вы не робот."
        +"<a href='" + href + "'>" + href + "</a></h2>"
  }
};



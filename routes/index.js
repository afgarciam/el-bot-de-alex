var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', {
      title: 'Express'
   });
});

var fbMsngr = require('fb-msngr')({
   access_token: "EAAKqWKL8sCUBAD6SGqUW5k3Tzqne2On7kz5uTCW5TlPTI9ZCN7Qzp5WsA6FMMAUAF2C2CmKf0DZCLqslXpzP3QE1B7SRXI7D7JCnfQwZAp4S7VZB8gdgzxmNsbFb2DJQNpPFIxZA3rO1ZCAVI207HZAzWcZBxZCUhTSvJF4z7ub4t2QZDZD",
   notification_type: "REGULAR",
   verify_token: "11132003",
   page_id: "158710861192004"
});

//Handle the receipt of text messages
fbMsngr.onTextReceived(function(uid, text) {
   console.log('text ' + text + ' - id ' + uid);
   text = text.trim().toUpperCase();
   if (text === "HOLA") {
      fbMsngr.getProfile(uid, function(err, first_name, last_name, profile_pic) {
         var textSend = 'Hola ' + first_name + ' ' + last_name + '!';
         fbMsngr.sendTextMessage(uid, textSend, function(err, id, mid) {
            console.log('mensaje enviado ' + textSend);
         });
      });
   } else if (text === "IMAGEN") {
      fbMsngr.sendImageMessage(uid, 'http://lorempixel.com/400/200/', function(err, id, mid) {
         console.log('mensaje  de imagen enviado ');
      });
   } else if (text === "TARJETA") {
      var bubbles = [
         fbMsngr.buildBubble('Ciudades', 'https://el-bot-de-alex.herokuapp.com/', 'http://lorempixel.com/400/200/city', 'Ciudades desde lorem pixel', null),
         fbMsngr.buildBubble('Gatos', 'https://el-bot-de-alex.herokuapp.com/', 'http://lorempixel.com/400/200/cats', 'Gatos desde lorem pixel', null)
      ];
      fbMsngr.sendGenericTemplateMessage(
         uid,
         bubbles,
         function(err, id, mid) {
            console.log('mensaje de burbuja enviado ');
         });
   } else if (text === "ENCUESTA") {
      var buttons = [
         fbMsngr.buildURLButton('a', 'https://el-bot-de-alex.herokuapp.com/'),
         fbMsngr.buildURLButton('b', 'https://google.com/'),
         fbMsngr.buildURLButton('c', 'https://twitter.com/')
      ];
      // var buttons =[
      //    fbMsngr.buildPostbackButton('a', post1),
      //    fbMsngr.buildPostbackButton('b', post2),
      //    fbMsngr.buildPostbackButton('c', post3)
      // ];
      fbMsngr.sendGenericTemplateMessage(
         uid,
         [fbMsngr.buildBubble('Matematica', null, null, 'Cuantos es 3 * 20 \n a) 90 \n b) 60 \n c) 85', buttons)],
         function(err, id, mid) {
            console.log('mensaje de encuesta enviado ');
         });
   } else {
      fbMsngr.getProfile(uid, function(err, first_name, last_name, profile_pic) {
         var textSend = 'Hola ' + first_name + ', no entiendo tu mensaje, por favor intenta enviando una de las siguientes palabras: \n Hola \n Imagen \n Tarjeta \n Encuesta \n :D';
         fbMsngr.sendTextMessage(uid, textSend, function(err, id, mid) {
            console.log('mensaje enviado ');
         });
      });
   }

});

fbMsngr.onMediaReceived(function(id, attachments) {
   console.log('se recibe un mensaje de media');
});

fbMsngr.onDelivered(function(id, mid) {
   console.log('mensaje entregado');
});

fbMsngr.onPostback(function(id, postback) {
	console.log('se tiene postback '+ postback);
});

//Handle verification with the build in middleware
router.get('/webhook/', fbMsngr.verify('La verificacion fallo'));

//Handle the received message
router.post('/webhook/', function(req, res) {
   fbMsngr.handle(req.body);
   res.sendStatus(200);
   res.end();
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var fbMsngr = require('fb-msngr')({
	access_token: "EAAKqWKL8sCUBAD6SGqUW5k3Tzqne2On7kz5uTCW5TlPTI9ZCN7Qzp5WsA6FMMAUAF2C2CmKf0DZCLqslXpzP3QE1B7SRXI7D7JCnfQwZAp4S7VZB8gdgzxmNsbFb2DJQNpPFIxZA3rO1ZCAVI207HZAzWcZBxZCUhTSvJF4z7ub4t2QZDZD",
	notification_type: "REGULAR",
	verify_token: "11132003",
	page_id: "158710861192004"
});

//Handle the receipt of text messages
fbMsngr.onTextReceived(function(uid, text) {
	console.log('text ' + text + ' - id '+ uid);

   if(text.trim().toUpperCase() == "HOLA"){
      fbMsngr.getProfile(uid, function(err, first_name, last_name, profile_pic) {
         var textSend = 'Hola '+ first_name +' '+ last_name +'!';
         fbMsngr.sendTextMessage(uid, textSend, function(err, id, mid){
               console.log('mensaje enviado '+ textSend);
         });
      });
   }
   // fbMsngr.sendTextMessage(uid, text, function(err, id, mid){
   //    console.log('mensaje enviado');
   // });
   // fbMsngr.getProfile(uid, function(err, first_name, last_name, profile_pic) {
	//      console.log('name '+ first_name + ' ' + last_name + ' pic '+profile_pic);
   // });
});

fbMsngr.onMediaReceived(function(id, attachments) {
	console.log('se recibe un mensaje de media');
});

fbMsngr.onDelivered(function(id, mid) {
	console.log('mensaje entregado');
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

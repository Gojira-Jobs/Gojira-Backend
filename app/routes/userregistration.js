var express = require('express');
var bodyparser = require('body-parser');
var router = express.Router();
var databasefunction = require('../databasefunction/userdatabase.js');
var emailcheck = require('../supported/emailcheck.js');
var nodemail = require('../supported/nodemail.js');
var gettoken = require('../supported/gettoken.js');

router.use(bodyparser());

router.post('/',function(req,res){
	console.log('In User Registration-->');
	if(!req.body) res.satus(401).send({'status': 0, 'data': 'Unauthorized User'});
	else{
			let obj = {
				'email' : req.body.email,
				'password' : req.body.password,
				'name' : req.body.name.toUpperCase(),
				'token' : 'No',
			};
			console.log('Coming Data: ', obj);
			emailcheck.check(obj.email).then((resolve)=>{
				console.log('Email is valid');
				databasefunction.emailfind(obj).then((resol)=>{
					if(resol === null ) {
						console.log('Email Unique');
						obj.token = gettoken(obj.email);
						databasefunction.insertdata(obj).then((solv)=> {
							console.log('Insertion Done Successfully');
							let maildata = {
								'email': obj.email,
								'subject': 'Gojira Account Confermation Code',
								'text': 'Welcome Message',
								'html_msg': '<b><h1>Welcome '+obj.name+' in Gojira</h1></b>'
							};
							let senddata = {
								'name': obj.name,
								'email':obj.email,
								'token': obj.token
							};
							nodemail(maildata).then((data)=> {
								console.log('Insertion Successsfully Done');
								res.status(200).send({'status':1,'data': senddata});
							}).catch((err)=> {
								console.log('Error due to mail transfer: ', err);
								res.status(500).send({'status':0,'err':'Internal Server Error!'});
							})
						}).catch((reje)=> {
							console.log('error in insertion: ',reje);
							res.status(500).send({'staus':0,'err':'Internal Server Error'});
						})
					}
					else{
						console.log('Duplicate Email');
						res.status(422).send({'status': 0, 'err': 'This mail-address already exist'});
					}
				}).catch((rej)=>{
					console.log('Find Error: ', rej);
					res.status(500).send({'status':0,'err':'Internal Server Error'});
				})
				
			}).catch((reject)=>{
				console.log('Email Inavlid');
				res.status(422).send({'status': 0, 'err':'Invalid email'});
			}) 
		}
})

module.exports = router;
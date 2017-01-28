var express = require('express');
var bodyparser = require('body-parser');
var router = express.Router();
var databasefunction = require('../databasefunction/userdatabase.js');
var emailcheck = require('../supported/emailcheck.js');
var Otp = require('../supported/otpgenerate.js');
var nodemail = require('../supported/nodemail.js');

router.use(bodyparser());

router.post('/',function(req,res){
	console.log('In User Registration-->');

	if(!req.headers.authheader) res.status(401).send({'status':0,'data':'Unauthorized User'});
	else if(req.headers.authheader === null || req.headers.authheader ==="") res.status(401).send({'status':0,'data':'Unauthorized User'});
	else if(!req.body) res.satus(401).send({'status': 0, 'data': 'Unauthorized User'});
	else{
		console.log('Else Block');
		let headerinfo = req.headers.authheader;
		headerinfo = headerinfo.split('--');
		console.log('Header Info: ', headerinfo);
		if(headerinfo[0] == 'hrportaluserregistration' && headerinfo[1] == '12345@bprras') {
			let obj = {
				'email' : req.body.email,
				'password' : req.body.password,
				'name' : req.body.name,
				'token' : 'No',
				'otp' : 0
			};
			emailcheck.check(obj.email).then((resolve)=>{
				console.log('Email is valid');
				databasefunction.emailfind(obj).then((resol)=>{
					if(resol === null ) {
						console.log('Email Unique');
						obj.otp = Otp();
						console.log('Obj.otp is: '+ obj.otp);
						databasefunction.insertdata(obj).then((solv)=> {
							console.log('Insertion Done Successfully');
							let maildata = {
								'email': obj.email,
								'subject': 'Gojira Account Confermation Code',
								'text': 'Use Below 4-digit code for verification',
								'html_msg': '<b><h1>Use Below 4-Digit Code to Activate Your GojiraAccount</h1><h3> '+' '+obj.otp+' '+'</h3></b>'
							};
							nodemail(maildata).then((data)=>{
								console.log('Successsfully Done');
								res.status(200).send({'status':1,'data':'4-Digit code send to your mail, please check'});
							}).catch((err)=>{
								console.log('Error due to mail transfer: ', err);
								res.status(500).send({'status':0,'data':'Internal Server Error!'});
							})
						}).catch((reje)=> {
							console.log('error in insertion: ',reje);
							res.status(500).send({'staus':0,'data':'Internal Server Error'});
						})
					}
					else{
						console.log('Duplicate Email');
						res.status(422).send({'status': 0, 'data': 'This mail-address already exist'});
					}
				}).catch((rej)=>{
					console.log('Find Error: ', rej);
					res.status(500).send({'status':0,'data':'Internal Server Error'});
				})
				
			}).catch((reject)=>{
				console.log('Email Inavlid');
				res.status(422).send({'status': 0, 'data':'Invalid email'});
			}) 

		}
		else{
			console.log('Header Not Match');
			res.status(401).send({'status':0,'data':'Unauthorized User'});
		}
	}
})

module.exports = router;
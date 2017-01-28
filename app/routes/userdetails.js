var express = require('express');
var router = express.Router();
var gettoken = require('../supported/gettoken.js');
var database = require('../databasefunction/userdatabase.js');
var bodyparser = require('body-parser');

router.use(bodyparser());

router.post('/',function(req,res){
	console.log('User Details..');
	if(!req.headers.authheader) res.status(422).send({'status': 0,'data':'Unauthorized User'});
	else{
		let headerinfo = req.headers.authheader;
		headerinfo = headerinfo.split('--');
		if(headerinfo[0] == 'hrportaluserdeatils' && headerinfo[1] == '12345@bprrsa'){
			console.log('header ok');
			let obj ={
				'email':req.body.email,
				'otp': req.body.otp
			};
			if(obj.otp == '0') res.status(401).send({'status':0,'data':'Unauthorized User'});
			else{
				database.otpfindupdate(obj).then((resolve)=> {
					if(resolve == null ) res.status(404).send({'status': 0,'data':'User Not Found'});
					else{
						let token = gettoken(obj.email);
						console.log('Token: ', token);
						obj.token = token;
						database.usertokenupdate(obj).then((solve)=>{
							if(solve == null) res.status(404).send({'status':0,'data':'User Not Found'});
							else{
								let senddata= {
									'token':obj.token,
									'name': resolve.name,
									'email': resolve.email,
									'gender': resolve.gender,
									'phonenumber': resolve.phonenumber
								};
								res.status(200).send({'status':1,'data':senddata});
							}
						}).catch((rej)=>{
							console.log('Error token update:',rej);
							res.status(500).send({'status':0,'data':'Internal Server Error'});
						})
					}
				}).catch((reject)=>{
					console.log('OTP Update Error:',reject);
					res.status(500).send({'status':0,'data':'Internal Server Error'});
				})
			}
		}
		else{
			console.log('Header Data Not Match');
			res.status(401).send({'status': 0,'data': 'Unauthorized User'});
		}
	}
})

module.exports = router;


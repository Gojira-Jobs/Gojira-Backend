var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var setfun = require('../supported/setpasswordfun.js');

router.use(bodyparser());

router.post('/set',function(req,res){
	console.log('Reset Password');
	if(!req.headers.authheader) res.status(401).send({'status':0,'data':'Unauthorized User'});
	else if(!req.body.email && !req.body.otp && !req.body.password) res.satus(422).send({'status': 0, 'data': 'Insufficient data'});
	else{
		console.log('ok');
		let headerinfo = req.headers.authheader;
		headerinfo = headerinfo.split('--');
		if(headerinfo[0] == 'hrportalforget' && headerinfo[1] == '12345@bprrsa') {
			console.log('Header Ok');
			let obj = {
				'email': req.body.email.toLowerCase(),
				'otp': req.body.otp,
				'isHr': req.body.isHr,
				'password': req.body.password,
				'token':'',
				'name':'',
				'ok':0
			};
			if(obj.isHr == true){
				setfun.adminset(obj).then((resolve)=>{
					if(resolve.ok == 1) res.status(200).send({'status':1,'data':resolve});
					else res.status(404).send({'status':0,'data':'User Not Found'});
				}).catch((reject)=> res.status(500).send({'status':0,'data':'Internal Server Error'}))
			}
			else{
				setfun.userset(obj).then((resolve)=>{
					if(resolve.ok == 1) res.status(200).send({'status':1,'data':resolve});
					else res.status(404).send({'status':0,'data':'User Not Found'});
				}).catch((reject)=> res.status(500).send({'status':0,'data':'Internal Server Error'}))
			}
		}
		else{
			console.log('Header Not Mathch');
			res.status(401).send({'status':0,'data':'Unauthorized User'});
		}
	}
})
module.exports = router;
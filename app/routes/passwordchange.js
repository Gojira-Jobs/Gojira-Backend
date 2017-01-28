var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var otpsend = require('../supported/otpsend.js');

router.use(bodyparser());
router.post('/verify',function(req,res){
	console.log('In Forget Password-->');

	if(!req.headers.authheader) res.status(401).send({'status':0,'data':'Unauthorized User'});
	else if(!req.body.email) res.satus(401).send({'status': 0, 'data': 'Unauthorized User'});
	else{
		let headerinfo = req.headers.authheader;
		headerinfo = headerinfo.split('--');
		if(headerinfo[0] == 'hrportalforget' && headerinfo[1] == '12345@bprras') {
			console.log('Header Ok');
			let obj = {
				'email': req.body.email.toLowerCase(),
				'isHr': req.body.isHr
			};
			console.log('OK 1');
			otpsend(obj).then((resolve)=> {
				if(resolve == 1) res.status(200).send({'status': 1, 'data': {'data':'4-digit otp send to mail','ishr':obj.isHr}});
				else res.status(404).send({'status': 0, 'data': 'User Not Found!'});
			}).catch((reject)=> res.status(500).send({'status': 0, 'data': 'Internal Server Error'}))
		}
		else{
			console.log('Header Not Mathch');
			res.status(401).send({'status':0,'data':'Unauthorized User'});
		}
	}
})

module.exports = router;
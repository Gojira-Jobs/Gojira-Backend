var express = require ('express');
var router = express.Router();
var adminauth = require('../authentication/authenticate.js');
var databasefunction = require('../databasefunction/admindatabase.js');

router.use(adminauth.admin);

router.post('/change',function(req,res){
	console.log('Change Password Module');
	if(!req.body) res.status(400).send({'success':false,'data':'Empty data'});
	else if(req.body.oldpassword == null || req.body.oldpassword == "") res.status(400).send({'status':0,'data':'provide old password'});
	else if(req.body.newpassword == null || req.body.newpassword == "") res.status(400).send({'status':0,'data':'provide new password'});
	else {
		let obj = {
			'email':req.headers.username.toLowerCase(),
			'oldpass': req.body.oldpassword,
			'newpass':req.body.newpassword
		};
		databasefunction.passwordchange(obj).then((resolve)=>{
			if(resolve === null || resolve.length <= 0) res.status(404).send({'status':0, 'data':'User Not Found'});
			else res.status(200).send({'status':1, 'data': 'password change successfully'});
		})
	}
})

router.post('/signout',function(req,res){
    console.log('In Signout');
    let obj = {
        'email': req.headers.username.toLowerCase()
    };

    databasefunction.signout(obj).then((resolve)=>{
        if(resolve === null || resolve.length <= 0) res.status(404).send({'status':0,'data':'User not found'});
        else res.status(200).send({'status':1, 'data':'Successfully signout'});
    }).catch((reject)=>{
        console.log('Signout Error: ', reject);
        res.status(500).send({'status': 0, 'data':'Internal Server Error'});
    })
})

module.exports = router;
var express = require ('express');
var router = express.Router();
var bodyparser = require('body-parser');
var superauth = require('../authentication/authenticate.js');
var databasefunction = require('../databasefunction/superuserdatabase.js');
var emailExistence = require('../supported/emailcheck.js');
var nodemail = require('../supported/nodemail.js');

router.use(superauth.superauth);
router.use(bodyparser());

router.post('/admin-insert',function(req,res){
    if(!req.body) res.status(400).send({'status': 0, 'data': 'No data present'});
    else if(req.body.email == "") res.status(400).send({'status': 0, 'data': 'provide email'});
    else{
         emailExistence.check(req.body.email).then((email_result)=>{
            console.log('Email Done');
                    databasefunction.adminemailcheck(req.body.email).then((resolve)=>{
                        console.log('Check Email');
                        if(resolve === null ){
                            console.log('Unique Email');
                            let obj = {
                                'email': req.body.email.toLowerCase(),
                                'password' : req.body.password,
                                'name' : req.body.name,
                                'gender': req.body.gender,
                                'token' : 'No',
                                'otp' : 'No'
                            };
                             console.log('Check Email Finish');
                            databasefunction.admininsert(obj).then((resolve)=> {
                                console.log('Successfully Inserted');
                                let senddata = {
                                     'email': obj.email,
                                     'subject': 'Account Create Confermation and Account Details',
                                     'msg': 'Your Userid: '+ obj.email +'and Password: '+ obj.password,
                                     'html_msg': '<b><h1>Welcome to Hr Portal</h1><h3>Use below information for first time login</h3><h4>Userid: '+ obj.email + ' and Password: '+ obj.password +'</h4></b>'
                                };
                                console.log(senddata);
                                console.log(nodemail);
                                nodemail(senddata).then((resolve)=>{
                                     console.log('Email Send');
                                     res.status(200).send({'status': 1,'data':'Inserted Successfully'});
                                 }).catch((reject)=>{
                                     console.log('Error due to mail sending but data inerted');
                                     res.status(500).send({'status': 0,'data':'Mail not send due to internal error but account created'});
                                 })
                            }).catch((err)=> {
                                console.log('Insertion Error: ',err);
                                res.status(500).send({'status': 0,'data':'Internal server error due to insertion'});
                            });
                        }
                        else{
                            console.log('Duplicate Email');
                            res.status(422).send({'status': 0,'data':'Duplicate email'});
                        }
                    }).catch((err)=>{
                        console.log('Error due to search email', err);
                        res.status(500).send({'status': 0,'data':'Internal error due search email'});
                    });
        }).catch((reject)=>{
        	console.log('Email Error:',reject);
        	res.status(422).send({'status': 0, 'data':'Email is invalid'});
        })
    }
})

router.post('/admin-delete',function(req,res){
    console.log('Inside Delete Function');
    if(!req.body) res.status(400).send({'success':false,'data':'Empty data'});
    else if(req.body.email === null || req.body.email == "") res.status(400).send({'success':false,'data':'provide email'});
    else{
        let email = req.body.email.toLowerCase();
        console.log('Username'+ email);
        databasefunction.admindelete(email).then((resolve)=>{
            console.log('Deletion done:'+ resolve);
            if (resolve == null) res.status(404).send({'status':0,'data':'User Not Found'});
            else res.status(200).send({'status':1,'data':'Deletion Done'});
        }).catch((reject)=> res.status(500).send({'status':0,'data':'Internal server error'}))
    }
})

router.post('/admin-list',function(req,res){
    console.log('In Admin List Post');
    databasefunction.adminlist().then((resolve)=> {
        if (resolve == null) res.status(404).send({'status': 0,'data': null});
        else res.status(200).send({'status': 1,'data': resolve});
    }).catch((reject)=>{
        console.log('Error Due To Retrive Data..');
        res.status(500).send({'status': 0, 'data': 'Internal Server Error'});
    });
})

router.post('/change',function(req,res){
	console.log('Change Password Module');
	if(!req.body) res.status(400).send({'success':false,'data':'Empty data'});
	else if(req.body.oldpassword == null || req.body.oldpassword == "") res.status(400).send({'status':0,'data':'provide old password'});
	else if(req.body.newpassword == null || req.body.newpassword == "") res.status(400).send({'status':0,'data':'provide new password'});
	else {
		let obj = {
			'username':req.headers.email.toLowerCase(),
			'oldpass': req.body.oldpassword,
			'newpass':req.body.newpassword
		};
		databasefunction.passwordchange(obj).then((resolve)=>{
			if(resolve === null) res.status(404).send({'status':0, 'data':'User Not Found'});
			else res.status(200).send({'status':1, 'data': 'password change successfully'});
		})

	}
})

router.post('/signout',function(req,res){
    console.log('In Signout');
    let obj = {
        'username': req.headers.email.toLowerCase()
    };
    databasefunction.signout(obj).then((resolve)=>{
        if(resolve === null) res.status(404).send({'status':0,'data':'User not found'});
        else res.status(200).send({'status':1, 'data':'Successfully signout'});
    }).catch((reject)=>{
        console.log('Signout Error: ', reject);
        res.status(500).send({'status': 0, 'data':'Internal Server Error'});
    })
})


module.exports = router;
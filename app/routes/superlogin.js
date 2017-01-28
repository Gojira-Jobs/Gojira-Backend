var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var logfunction = require('../loginfunction/login.js');

router.use(bodyparser());

router.post('/',function(req,res){
	console.log('Authenticat Post Running');
    if(!req.headers.setdata){
        console.log('Headers Not found..');
        res.status(401).send({'success':false,'data':'unauthorized user'});
    } 
    else{
    	console.log('Header Found');
    	let headerdata = req.headers.setdata.split(':');
        let uid = headerdata[0];
        let pas = headerdata[1];
        if(uid === 'hrportalsuper' && pas === '1234bprrsa'){
        	let username = req.body.username.toLowerCase();
            let password = req.body.password;
            console.log(username,password);
            logfunction.superlogin(username,password).then((resolve)=>{
            	console.log('Data are: '+ resolve);
                    if(resolve.ok === 1){
                     console.log('Login Successfully Done..');
                     console.log('Resolve Token'+ resolve.tokenid);
                     let senddata = {
                     	 token: resolve.tokenid,
                      	 name: resolve.name,
                      	 username: resolve.username
                     };
                     res.status(200).send({'status':1,'data':senddata});
                    }
                    else{
                    	console.log('Userid and Password not match');
                    	res.status(200).send({'status':0,'data':'Userid or Password not match'});
                    }
            }).catch((reject)=>{
            	console.log('Internal Error');
            	res.status(500).send({'status':false,'data':'Internal Server Error'});
            })
        }
        else{
        	console.log('Not Match, Unauthorized User!');
        	res.status(401).send({'status':0,'data': 'Unauthorized user'});
        }
    }
})

module.exports = router;
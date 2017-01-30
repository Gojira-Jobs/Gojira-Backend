var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var logfunction = require('../loginfunction/login.js');

router.use(bodyparser());

router.post('/',function(req,res){
    let username = req.body.email;
    let password = req.body.password;
    let usertype = req.body.isHr;
    console.log(username,password,usertype);
    if(usertype == true){
        console.log('User is HR');
        logfunction.adminlogin(username,password).then((resolve)=> {
            console.log('Data are: '+ resolve);
            if(resolve.ok === 1){
                console.log('Login Successfully Done..');
                console.log('Resolve Token'+ resolve.tokenid);
                
                res.status(200).send({'status':1,'data':resolve});
            }
            else {
                console.log('Userid or Password not match');
                res.status(401).send({'status':0,'err':'Unauthorized User'});
            }
        }).catch((rej)=>{
            console.log('Internal Error');
            res.status(500).send({'status':0,'data':'Internal Error'});
        })
    }
    else{
            console.log('User is User');
            logfunction.userlogin(username,password).then((resolve)=>{
                console.log('Data are: '+ resolve);
                if(resolve.ok === 1){
                    console.log('Login Successfully Done..');
                    console.log('Resolve Token'+ resolve.tokenid);
                let senddata = {
                    token: resolve.tokenid,
                    name: resolve.name,
                    email: resolve.email,
                    gender: resolve.gender,
                    ishr: true
                };
                    res.status(200).send({'status':1,'data':senddata});
                }
                else {
                    console.log('Userid or Password not match');
                    res.status(401).send({'status':0,'err':'Userid or Password Not Match'});
                }

            }).catch((reject)=>{
                console.log('Internal Error');
                res.status(500).send({'status':0,'err':'Internal Error'});
            })
    }
})

module.exports = router;



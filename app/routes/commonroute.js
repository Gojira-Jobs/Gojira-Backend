var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var logfunction = require('../loginfunction/login.js');

router.use(bodyparser.urlencoded({ extended: false}));
router.post('/',function(req,res){
    console.log('Authenticat Post Running');
    if(!req.headers.setdata){
        console.log('Headers Not found..');
        res.status(401).send({'success':false,'data':'unauthorized user'});
    } 
    else{
        console.log('Headers Found');
        let headerdata = req.headers.setdata.split(':');
        let uid = headerdata[0];
        let pas = headerdata[1];
        if(uid === 'hrportal' && pas == '1234bprrsa'){
            let username = req.body.username.toLowerCase();
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
                   let senddata = {
                    token: resolve.tokenid,
                    name: resolve.name,
                    email: resolve.email,
                    ishr: true
                   };
                    res.status(200).send({'status':1,'data':senddata});
                }
                else {
                    console.log('Userid or Password not match');
                    res.status(401).send({'status':0,'data':null});
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
                      ishr: false
                     };
                     res.status(200).send({'status':1,'data':senddata});
                 }
                 else {
                     console.log('Userid or Password not match');
                     res.status(401).send({'status':0,'data':null});
                 }

                }).catch((reject)=>{
                    console.log('Internal Error');
                    res.status(500).send({'status':1,'data':'Internal Error'});
                })
            }
        }
        else{
            console.log('Headers not correct');
            res.status(401).send({'success':false,'data':'unauthorized user'});
        }
    }
})

module.exports = router;



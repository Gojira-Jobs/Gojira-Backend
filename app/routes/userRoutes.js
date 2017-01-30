var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser =require('body-parser');
var secretKey=require('../../config').secret;
var errors=require('../config');
var router=express.Router();
var nodemailer = require('@nodemailer/pro');
let userPromises=require('../promises/userPromises');
router.post('/register',(req,res)=>{
    var data=req.body;
  
    data.token=jwt.sign({email:data.email,password:data.password},secretKey,{ expiresIn:"10h"});
    console.log(data);
    var user=userPromises.addUser(data);
    user.then((doc)=>{

        res.status(errors.CREATED.code).json({msg:"User added..",data:{username:doc.name,token:doc.token,email:doc.email}});
    }).catch((err)=>{
        console.log(err);
        res.status(errors.INTERNAL.code).json({msg:"Registration Failed..."});
    });
});

router.route('/users')
.get((req,res,next)=>{
        let getData = userPromises.getUsers();
        getData.then((docs)=>{
            console.log(req.decoded.email);
            res.json(docs);
       }).catch((err)=>{
           res.end("Can't Serve Anything..");
       })
});
router.route('/user')
.get((req,res,next)=>{
    let user=userPromises.searchForUser(req.decoded.email);
    user.then((user)=>{
        if(!user) res.json({success:false,data:null,msg:"Not found Any DAta"});
        else{
            res.json({success:true,data:user,msg:"User data send"});
        }
    })
})
.put((req,res,next)=>{
    if(!req.body)
        res.status(errors.BADREQUEST.code).json({msg:errors.BADREQUEST.msg});
    else
        res.status(errors.ACCEPTED.code).json({msg:errors.ACCEPTED.msg});
});


module.exports=router;
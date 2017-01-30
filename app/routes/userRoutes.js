var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser =require('body-parser');
var secretKey=require('../../config').secret;
var errors=require('../config');
var router=express.Router();
//var nodemailer = require('@nodemailer/pro');
let userPromises=require('../promises/userPromises');
var userauth=require('../authentication/authenticate');
var databasefunction = require('../databasefunction/userdatabase.js');

router.route('/users')
.get((req,res,next)=>{
    console.log("fhhf");
        let getData = userPromises.getUsers();
        getData.then((docs)=>{
            res.json(docs);
       }).catch((err)=>{
           res.end("Can't Serve Anything..");
       })
});
router.use(userauth.user);
// router.post('/register',(req,res)=>{
//     var data=req.body;
  
//     data.token=jwt.sign({email:data.email,password:data.password},secretKey,{ expiresIn:"10h"});
//     console.log(data);
//     var user=userPromises.addUser(data);
//     user.then((doc)=>{

//         res.status(errors.CREATED.code).json({msg:"User added..",data:{username:doc.name,token:doc.token,email:doc.email}});
//     }).catch((err)=>{
//         console.log(err);
//         res.status(errors.INTERNAL.code).json({msg:"Registration Failed..."});
//     });
// });



router.route('/user')
.get((req,res,next)=>{
    console.log("gsggs "+req.headers.email);
    let user=userPromises.searchForUser(req.headers.email);
    user.then((userdata)=>{
        if(!userdata) res.json({success:false,data:null,msg:"Not found Any DAta"});
        else{
           // userdata=JSON.parse(userdata);
            var userData=userdata.toObject();
           userData.isHr=false;
            console.log(userData);
           // console.log("userdata:" + userdata);
            res.json({success:true,data:JSON.stringify(userData),msg:"User data send"});
        }
    }).catch((err)=>{
        console.log(err);
    })
})
.put((req,res,next)=>{
    if(!req.body.email)
        res.status(errors.BADREQUEST.code).json({msg:errors.BADREQUEST.msg});
    else{
        console.log(req.body);
        var updateData=userPromises.setData(req.body);
        updateData.then((data)=>{
            res.status(errors.ACCEPTED.code).json({msg:"Updation Completed"});
        }).catch((err)=>{
            res.status(errors.INTERNAL.code).json({msg:errors.INTERNAL.msg})
        });
        
    }
});



module.exports=router;
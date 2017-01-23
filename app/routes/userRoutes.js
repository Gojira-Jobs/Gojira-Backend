var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser =require('body-parser');
var secretKey=require('../../config').secret;
var router=express.Router();
let userPromises=require('../promises/userPromises');
//app.use(bodyParser.urlencoded({extended:false}));
//app.use(bodyParser.json());
router.post('/authenticate',(req,res)=>{
    let user=userPromises.searchForUser(req.body.email);
    user.then((user)=>{
        if(!user) res.json({success:false,msg:"User Not found.."});
        else if(user && user.password!=req.body.password) res.json({success:false,msg:"password doesn't match"});
        else{
            console.log("Entered",secretKey);
            var token=jwt.sign({email:user.email,password:user.password},secretKey,{ expiresIn:"10h"});
            console.log("token:",token);
            res.json({ success:true,message:"Enjoy your token",token:token});
        }
    });
});
router.use((req,res,next)=>{
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
            jwt.verify(token,secretKey,(err,decoded)=>{
                if(err){
                    console.log(err);
                    return res.json({success:false,msg:"Failed to access "})
                }
                else{
                    console.log("Sooooooooooooo",decoded)
                    req.decoded=decoded;
                    next();
                }
            })
    }
    else{
        res.status(403).json({success:false,msg:"Token not found.."});
    }
})
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


module.exports=router;
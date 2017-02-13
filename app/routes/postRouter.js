var express = require('express');
var router = express.Router();
var postPromises=require('../promises/postPromises');
let errors = require("../config");
var authenticate = require('../authentication/authenticate.js');


router.route('/joblisting')
.get((req,res,next)=>{
    var getData=postPromises.getPosts();
    getData.then((docs)=>{
        if(!docs) res.status(errors.ACCEPTED.code).json({status:0,jobs:docs,msg:errors.ACCEPTED.msg});
        else res.status(errors.ACCEPTED.code).json({status:1,jobs:docs,msg:errors.ACCEPTED.msg});
    }).catch((err)=>{
        res.status(errors.INTERNAL.code).json({error:errors.INTERNAL.msg});
    })
})

router.route('/matchpass')
.post((req,res,next)=>{
    console.log("Inside Password Match Apply");
    let obj={
        'email':req.headers.email,
        'token':req.headers.token,
        'oldPass':req.body.oldPass,
        'isHr':req.body.isHr
    };
    console.log(obj);
    var match=postPromises.passwordMatch(obj);
    match.then((user)=>{
        if(user){
            res.status(errors.CREATED.code).json({status:1});
        }
        else
        {
            res.status(errors.CREATED.code).json({status:0,msg:"Old Password is not correct"});
        }
    }).catch((err)=> {
        console.log('In Error1');
        if(err == null || err == undefined)
            res.status(errors.BADREQUEST.code).json({status:0,msg:"Old Password is not correct"});
        else
            res.status(errors.BADREQUEST.code).json({status:0,msg:errors.BADREQUEST.msg});
    })
})

router.use(authenticate.user);

router.route('/apply')
.post((req,res,next)=>{
    console.log("Inside Job Apply");
    let obj={
        'email':req.body.email,
        'job_id':req.body.job_id,
        'resume':req.body.resume
    };
    console.log(obj);
    var applied=postPromises.addApplicant(obj);
    applied.then((msg)=>{
        res.status(errors.CREATED.code).json({status:1,job_id:obj.job_id,msg:msg});
    }).catch((err)=> {
        console.log('In Error1');
        if(err == null || err == undefined)
            res.status(errors.BADREQUEST.code).json({msg:"AppliedBy by UnAuthorized Person"});
        else
            res.status(errors.BADREQUEST.code).json({msg:errors.BADREQUEST.msg});
    })
})

router.route('/applied')
.get((req,res,next)=>{
    var getJobs = postPromises.getAppliedJobInfo(req.query.email);
    getJobs.then((docs)=>{
        if(!docs) res.status(errors.ACCEPTED.code).json({status:0,users:docs,msg:errors.ACCEPTED.msg});
        else res.status(errors.ACCEPTED.code).json({status:1,jobs:docs,msg:errors.ACCEPTED.msg});
    }).catch((err)=>{
        res.status(errors.INTERNAL.code).json({error:errors.INTERNAL.msg});
    })
})


 module.exports=router;
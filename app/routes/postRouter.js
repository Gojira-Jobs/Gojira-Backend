var express = require('express');
var router = express.Router();
var postPromises=require('../promises/postPromises');
let errors = require("../config");
var authenticate = require('../authentication/authenticate.js');

//router.use(authenticate.admin);

router.route('/joblisting')
.post((req,res,next)=>{
    var postCreated=postPromises.addPost(req.body);
    postCreated.then((msg)=>{
        res.status(errors.CREATED.code).json({msg:msg});
    }).catch((err)=>{
        if(err===null || err === 'undefined')
            res.status(errors.BADREQUEST.code).json({msg:"PostBy by UnAuthorized Person"});
        else
            res.status(errors.BADREQUEST.code).json({msg:errors.BADREQUEST.msg});
    })

})
.get((req,res,next)=>{
    var getData=postPromises.getPosts();
    getData.then((docs)=>{
        if(!docs) res.status(errors.ACCEPTED.code).json({status:0,jobs:docs,msg:errors.ACCEPTED.msg});
        else res.status(errors.ACCEPTED.code).json({status:1,jobs:docs,msg:errors.ACCEPTED.msg});
    }).catch((err)=>{
        res.status(errors.INTERNAL.code).json({error:errors.INTERNAL.msg});
    })
})
router.route('/hr/postedJobs')
.get((req,res,next)=>{
    
    var getPostedJobs = postPromises.getPostedJobs(req.query.email);

    getPostedJobs.then((docs)=>{
        res.status(errors.ACCEPTED.code).json({docs:docs});
    }).catch((err)=>{
        if(err===null || err === 'undefined')
            res.status(errors.ACCEPTED.code).json({msg:"User Not Posted anything"});
        else
            res.status(errors.INTERNAL.code).json({msg:errors.INTERNAL.msg});
    });
})

router.route('/apply')
.post((req,res,next)=>{
    console.log("Inside Job Apply");
    let obj={
        'email':req.body.email,
        'job_id':req.body.job_id
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
.get((req,res,next)=>{
    var getApplicants = postPromises.getApplicantInfo(req.query.job_id);
    getApplicants.then((docs)=>{
        if(!docs) res.status(errors.ACCEPTED.code).json({status:0,users:docs,msg:errors.ACCEPTED.msg});
        else res.status(errors.ACCEPTED.code).json({status:1,jobs:docs,msg:errors.ACCEPTED.msg});
    }).catch((err)=>{
        res.status(errors.INTERNAL.code).json({error:errors.INTERNAL.msg});
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
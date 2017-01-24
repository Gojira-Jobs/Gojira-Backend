var express = require('express');
var router = express.Router();
var postPromises=require('../promises/postPromises');
let errors = require("../config");
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
 module.exports=router;
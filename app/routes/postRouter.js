var express = require('express');
var router = express.Router();
var postPromises=require('../promises/postPromises');
router.route('/joblisting')
.post((req,res,next)=>{
    
})
.get((req,res,next)=>{
    var getData=postPromises.getPosts();
})
 module.exports=router;
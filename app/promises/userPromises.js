var User = require('../models/user');
exports.searchForUser=(mailId)=>{
    return new Promise((resolve,reject)=>{
        User.findOne({email:mailId},(err,user)=>{
            if(err) reject("Error during quering");
            else resolve(user);
        })
       
    })
}
exports.getUsers=()=>{
    return new Promise((resolve,reject)=>{
        let project={_id:0,name:1,email:1,mobile:1,password:1}
        User.find({},project,(err,docs)=>{
            if(err) reject(err);
            else resolve(docs);
        })
    })
}
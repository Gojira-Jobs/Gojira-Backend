var User = require('../models/user');
module.exports={
        searchForUser:((mailId)=>{
        return new Promise((resolve,reject)=>{
            User.findOne({email:mailId},(err,user)=>{
                if(err) reject("Error during quering");
                else resolve(user);
            })
        
        })
    }),
    getUsers:(()=>{
        return new Promise((resolve,reject)=>{
            let project={_id:0,password:0,_v:0}
            User.find({},project,(err,docs)=>{
                if(err) reject(err);
                else resolve(docs);
            })
        })
    }),
     setData:((obj)=>{
        return new Promise((resolve,reject)=>{
        User.update({email:obj.email},{$set:obj},(err,doc)=>{
                if(err){
                    console.log(err);
                    reject(err);
                } 
                else{
                    console.log(doc);
                    resolve(doc);
                }

            })
        })
    }),
    addUser:(function(obj){
        return new Promise((resolve,reject)=>{
            User.create(obj,(err,docs)=>{
                if(err)
                    reject(err);
                else
                    resolve(docs);
            });
        });
    })
}

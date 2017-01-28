var mongoose = require('mongoose');
var postTable=require('../models/admin').postSchema;
var hrTable=require('../models/admin').hrSchema;
function searchForAdmin(mailId){
    return new Promise((resolve,reject)=>{
        hrTable.findOne({email:mailId},{_id:1},(err,doc)=>{
            if(err) {
                console.log("doc:",err);
            reject(err);}
            else{
                
                resolve(doc);
            } 
        })
    });
}
module.exports={
    getPosts:(function(){
       return new Promise((resolve,reject)=>{
           postTable.find({},{_id:0,postedBy:0},(err,docs)=>{
               if(err) reject(err);
               else resolve(docs);
            })
       });
    }),
    addPost:(function(data){
       return new Promise((resolve,reject)=>{
           let HrFinder=searchForAdmin(data.postedBy);
           console.log("data:",data);
        HrFinder.then((doc)=>{
            
            if(!doc) reject(doc)
            else {
                
                let postData={job_id:data.job_id,category:data.category,
                    title:data.title,description:data.description,
                    AgeLimit:data.AgeLimit,WorkDetails:data.WorkDetails,
                EduDetails:data.EduDetails,last_date:new Date(data.last_date),WorkPlace:data.WorkPlace,postedBy:doc._id};
                postTable.create(postData,(err,doc)=>{
                    if(err){
                        console.log(err)
                        reject(err);}
                    else{
                        console.log("User Created");
                        resolve("User Created..");
                    }  
                })
            }
        }).catch((err)=>{
            console.log(err);
            reject(err);
        })

       }) 
    })
}


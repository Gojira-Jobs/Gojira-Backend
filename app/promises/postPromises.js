var mongoose = require('mongoose');
var postTable=require('../models/admin').postSchema;
var appTable=require('../models/apply');
var hrTable=require('../models/admin').hrSchema;
var User = require('../models/user');

function searchForAdmin(mailId){
    return new Promise((resolve,reject)=>{
        hrTable.findOne({email:mailId},(err,doc)=>{
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

    setData:((obj)=>{
        return new Promise((resolve,reject)=>{
        hrTable.update({email:obj.email},{$set:obj},(err,doc)=>{
                if(err){
                    console.log(err);
                    reject(err);
                } 
                else{
                    console.log(doc);
                    var user=searchForAdmin(obj.email);
                    console.log(user);
                 //   resolve(doc);
                    user.then((doc)=>resolve(doc)).catch((err)=>reject(err));
                    
                }

            })
        })
    }),

    searchForHr: (mailId)=>{
        return new Promise((resolve,reject)=>{
            hrTable.findOne({email:mailId},(err,doc)=>{
                if(err) {
                    console.log("doc:",err);
                reject(err);
                }
                else{
                    resolve(doc);
                } 
            })
        });
    },

    getPostedJobs:(mailId)=>{
        return new Promise((resolve,reject)=>{
                var HrFinder=searchForAdmin(mailId);
                HrFinder.then((doc)=>{
                    if(!doc) reject(doc);
                    else{
                        postTable.find({postedBy:doc._id},{postedBy:0,_v:0},(err,docs)=>{
                            if(err) reject(err);
                            else resolve(docs);
                        })
                    }
                }).catch((err)=>{
                    reject(err);
                })
        })
    },
    addPost:(function(data){
       return new Promise((resolve,reject)=>{
           let HrFinder=searchForAdmin(data.postedBy);
           console.log("data:",data);
        HrFinder.then((doc)=>{
            
            if(!doc) reject(doc)
            else {
                
                let postData={job_id:data.job_id,category:data.category,
                    title:data.title,description:data.description,
                    AgeLimit:data.AgeLimit,WorkExp:data.WorkExp,
                EduDetails:data.EduDetails,last_date:data.last_date,Joining:data.Joining,
                WorkPlace:data.WorkPlace,postedBy:doc._id};
                postTable.create(postData,(err,doc)=>{
                    if(err){
                        console.log(err)
                        reject(err);}
                    else{
                        console.log("User Created");
                        resolve("Job posted");
                    }  
                })
            }
        }).catch((err)=>{
            console.log(err);
            reject(err);
        })

       }) 
    }),

    addApplicant: function(data){
       return new Promise((resolve,reject)=>{
                console.log("Inside Job applicant");
                //let appData={job_id:data.job_id,email:data.email};
                console.log(data);
                appTable.create(data,(err,res)=>{
                    console.log('Create Section');
                    if(err){
                        console.log('Error in addApplication: ',err);
                        reject(err);}
                    else{
                        console.log('Result Found: ', res);
                        resolve("Applied Successfully");
                    }  
                })
       }) 
    },
    getApplicantInfo:(job_id)=>{
        return new Promise((resolve,reject)=>{
                        appTable.find({job_id:job_id},{email:1,resume:1},(err,docs)=>{
                            if(err) reject(err);
                            else resolve(docs);
                        })
                    })
    },

    getAppliedJobInfo:(email)=>{
        return new Promise((resolve,reject)=>{
                        appTable.find({email:email},{job_id:1,_id:0},(err,docs)=>{
                            if(err) reject(err);
                            else resolve(docs);
                        })
                    })
    },

    getUserInfo:((mailId)=>{
        return new Promise((resolve,reject)=>{
            User.findOne({email:mailId},{password:0,_id:0,token:0,_v:0,isHr:0},(err,user)=>{
                if(err) reject("Error during quering");
                else resolve(user);
            })
        
        })
    }),

    passwordMatch:((obj)=>{
        console.log("inside password promise",obj);
        return new Promise((resolve,reject)=>{
            if(obj.isHr==false){
                User.findOne({email:obj.email, password:obj.oldPass},{password:0,_id:0,token:0,_v:0,isHr:0},(err,user)=>{
                    if(err) reject(0);
                    else resolve(user);
                })
            }
            else{
                hrTable.findOne({email:obj.email, password:obj.oldPass},{password:0,_id:0,token:0,_v:0,isHr:0},(err,user)=>{
                    if(err) reject(0);
                    else resolve(user);
                })
            }
        })
    })
}


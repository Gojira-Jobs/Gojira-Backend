var mongoose = require('mongoose');
var super_modal = require('../models/super_user.js')
var admin = require('../models/admin.js');
module.exports = { 
        superlogin: (obj)=>{
        return new Promise((resolve, reject)=>{
            if(obj.uid === '' || obj.pass === '') {
            reject(err);
            }
            else{
                    super_modal.find({username: obj.username, password: obj.password},function(err,data){
                    if(err) reject(err);
                    else resolve(data);
                });
            }
        });
        
    },

    updatetoken: (obj)=> {
        return new Promise((resolve,reject)=>{
            console.log('In Update Token Function');
            console.log(obj.token);
            super_modal.findOneAndUpdate({'username':obj.username},{$set:{'token':obj.token}},(err,data)=> {
                if(err) reject('Error Occure');
                else resolve (data);
            });
        });
    },

    findtoken: (obj)=>{
        return new Promise((resolve,reject)=> {
                console.log('In Find Token Function: '+ obj.token,obj.username);
                super_modal.findOne({'username': obj.username, 'token': obj.token},{username:0,password:0,_id:0},(err,result)=> {
                        console.log('Data: ', result);
                        if(err) reject(err);
                        else resolve (result);
                });
        });
    },

    passwordchange: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In Change Password:', obj.username,obj.oldpass,obj.newpass);
            super_modal.findOneAndUpdate({'username':obj.username,'password':obj.oldpass},{$set:{'password':obj.newpass}},(err,data)=> {
                console.log('Data: ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    signout:(obj)=> {
        return new Promise((resolve,reject)=> {
            super_modal.findOneAndUpdate({'username': obj.username},{$set:{'token':'No'}},(err,data)=> {
                console.log('data: ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    adminlist: ()=>{
        return new Promise((resolve,reject)=>{
            console.log('In Admin List Find Function');
            admin.hrSchema.find({},{_id:0,password:0,token:0,otp:0},(err,result)=>{
                console.log('List seraching done');
                console.log('List is: ', result);
                if(err) reject(err);
                else resolve(result);
            });
        });
    },

    adminemailcheck: (email)=> {
        return new Promise((resolve,reject)=> {
            console.log('In Admin data Insert Function');
            admin.hrSchema.findOne({'email': email},(err,result)=>{
                if(err) reject(err);
                else{
                    console.log(result);
                     resolve(result);
                }
            });
        });
    },

    admininsert: (obj)=>{ 
        return new Promise((resolve,reject)=>{
            console.log('In Admin Insert List Function');
            admin.hrSchema.create(obj,(err,data)=>{
                console.log('Insertion callback function');
                if(err) reject(err);
                else resolve(data);
            })
        });
    },

    admindelete: (email)=>{
        return new Promise((resolve,reject)=>{
            console.log('In Admin Delete Function: ');
            admin.hrSchema.findOneAndRemove({'email':email}, (err,result)=>{
                console.log('Find and deletion done');
                if(err) reject(err);
                else resolve(result);
            });
        });
    }
}
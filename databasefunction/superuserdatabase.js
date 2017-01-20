var mongoose = require('mongoose');
var super_modal = require('../modal/super_user/super_user.js')
var Promise = require('bluebird');
module.exports = (obj)=>{
    return new Promise((resolve, reject)=>{
        if(obj.uid === '' || obj.pass === '') {
           reject(err);
        }
        else{
                super_modal.find({uid:obj.uid,password:obj.pass},function(err,data){
                if(err) reject(err);
                else resolve(data);
            });
        }
    });
    
}
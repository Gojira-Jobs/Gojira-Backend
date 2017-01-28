var admin = require('../models/admin.js');

module.exports = {
    adminlogin: (obj)=>{
        console.log('In Admin LOgin-> To Find Email..');
        return new Promise((resolve,reject)=> {
            admin.hrSchema.find(obj,(err,data)=>{
                console.log('In Admin-> Data find', data);
                if(err) reject(err);
                else resolve(data);
            })
        });
    },

    emailfind: (obj)=> {
        return new Promise((resolve,reject)=>{
            console.log('In Admin-> To email find');
            admin.hrSchema.findOne({'email': obj.email},(err,data)=> {
                console.log('Data Find: ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    admintokenupdate: (obj)=>{
        console.log('In Admin-> Token Update..');
        console.log('In Update Token: '+ obj.token);
        return new Promise((resolve,reject)=>{
            admin.hrSchema.findOneAndUpdate({'email':obj.email},{$set:{'token':obj.token}},(err,data)=>{
                console.log('In Admin-> Token Update ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    admintokenfind: (obj)=>{
        return new Promise((resolve,reject)=> {
            console.log('In Admin-> Find Token');
            admin.hrSchema.findOne({'email':obj.email,'token':obj.token},{_id: 0, name: 0, password:0},(err,data)=> {
                console.log('In Admin-> Token Find ', data);
                if(err) reject(err);
                else resolve(data);
            })
        })
    },

    passwordchange: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In Change Password:', obj.email,obj.oldpass,obj.newpass);
            admin.hrSchema.findOneAndUpdate({'email':obj.email,'password':obj.oldpass},{$set:{'password':obj.newpass}},(err,data)=> {
                console.log('Data: ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    otpupdate: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In Admin-> Otp Update');
            admin.hrSchema.findOneAndUpdate({'email': obj.email},{$set:{'otp':obj.otp}},(err,data)=>{
                console.log('Data: ',data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    passtokenset: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In Admin-> Pass and Token Update');
            admin.hrSchema.findOneAndUpdate({'email':obj.email,'otp':obj.otp},{$set:{'password':obj.password,'token':obj.token,'otp':0}},(err,data)=> {
                console.log('Data: ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    signout:(obj)=> {
        return new Promise((resolve,reject)=> {
            admin.hrSchema.findOneAndUpdate({'email': obj.email},{$set:{'token':'No'}},(err,data)=> {
                console.log('data: ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    }
}
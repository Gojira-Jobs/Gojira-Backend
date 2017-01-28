var User = require('../models/demouser.js');

module.exports = {

    emailfind: (obj)=>{
        return new Promise((resolve,reject)=> {
            console.log('In User-> Find Eamil');
            User.findOne({'email':obj.email},(err,data)=> {
                console.log('Data: ',data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    insertdata: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In User-> Insert Data');
            User.create(obj,(err,data)=> {
                console.log('Inasertion Callback');
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    userlogin: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In User-> To Login');
            User.findOne(obj,(err,data)=> {
                console.log('In User-> Data Find: '+ data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    usertokenupdate: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In User-> To Update');
            User.findOneAndUpdate({'email':obj.email},{$set:{'token':obj.token}},(err,data)=>{
                console.log('User Token Update');
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    usertokenfind: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In User-> Find Token');
            User.findOne({'email': obj.email, 'token': obj.token},{_id:0,email:0,otp:0,name:0,password:0},(err,data)=> {
                console.log('Token Find:' + data);
                if(err) reject(err);
                else resolve(data);
            })
        });
    },

    passwordchange: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In Change Password:', obj.email,obj.oldpass,obj.newpass);
            User.findOneAndUpdate({'email':obj.email,'password':obj.oldpass},{$set:{'password':obj.newpass}},(err,data)=> {
                console.log('Data: ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    otpupdate: (obj)=>{
        return new Promise((resolve,reject)=> {
            console.log('In User-> Otp Update');
            User.findOneAndUpdate({'email': obj.email},{$set:{'otp':obj.otp}},(err,data)=>{
                console.log('Data: ',data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    passtokenset: (obj)=> {
        return new Promise((resolve,reject)=> {
            console.log('In User-> Pass and Token Update');
            User.findOneAndUpdate({'email':obj.email,'otp':obj.otp},{$set:{'password':obj.password,'token':obj.token,'otp':0}},(err,data)=> {
                console.log('Data: ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    },

    signout:(obj)=> {
        return new Promise((resolve,reject)=> {
            User.findOneAndUpdate({'email': obj.email},{$set:{'token':'No'}},(err,data)=> {
                console.log('data: ', data);
                if(err) reject(err);
                else resolve(data);
            });
        });
    }
}
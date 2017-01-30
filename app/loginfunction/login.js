var admin = require('../databasefunction/admindatabase.js');
var user = require('../databasefunction/userdatabase.js');
var gettoken = require('../supported/gettoken.js');
var superuser = require('../databasefunction/superuserdatabase.js');

module.exports = {
    adminlogin: (username,password)=> {
        return new Promise((resol,rej)=>{
            console.log('Admin Promise Enter-->');
             let obj ={
                'email':username.toLowerCase(),
                'password':password
             };
            admin.adminlogin(obj).then((resolve)=>{
                if(resolve == null || resolve.length <= 0){
                    console.log('Data Not Found');
                    resol  ({ok:2});
                }
                else{
                    console.log('Admin Found now wait for token');
                    let token = gettoken(obj.email);
                    console.log('Token is: ',token);
                    admin.admintokenupdate({'email':obj.email,'token':token}).then((resolv)=>{
                        console.log('Update Result: '+ resolv);
                        let senddata = {
                                ok:1,
                                tokenid: token,
                                name: resolv.name,
                                email: resolv.email,
                                gender: resol.gender,
                        };
                        console.log('From Login send data: '+ senddata);
                        resol (senddata);
                    }).catch((reject)=>{
                        console.log('Reject due to update token:', reject);
                        rej( {ok:3} );
                    })
             }
            }).catch((reject)=>{
                console.log('Error in adminlogin');
                rej( {ok:3});
            })
        });
    },

    userlogin: (username,password)=> {
            return new Promise((resol,rej)=>{
            console.log('User Promise Enter');
             let obj ={
                'email':username.toLowerCase(),
                'password':password
             };
            user.userlogin(obj).then((resolve)=>{
                console.log('Resolve:', resolve);
                if(resolve == null || resolve.length <= 0){
                    console.log('User Data Not Found');
                    resol  ({ok:2});
                }
               else {
                    console.log('User Fond now wait for token');
                    let token = gettoken(obj.email);
                    console.log('Token is: ',token);
                    user.usertokenupdate({'email':username,'token':token}).then((resolv)=>{
                        console.log('Update Result: '+ resolv);
                        let senddata = {
                                ok:1,
                                tokenid: token,
                                name: resolv.name,
                                email: resolv.email,
                                phonenumber: resolv.phonenumber,
                                gender: resolv.gender,
                                hr : false
                        };
                        resol (senddata);
                    }).catch((reject)=>{
                        console.log('Reject due to update token');
                        rej( {ok:3} );
                    })
                }
            }).catch((reject)=>{
                console.log('Error in userlogin');
                rej( {ok:3});
            })
        });    
       
    },

    superlogin: (username,password)=> {
            return new Promise((resol,rej)=>{
            console.log('Super Promise Enter');
             let obj ={
                'username':username,
                'password':password
             };
            superuser.superlogin(obj).then((resolve)=>{
                console.log('Resolve:', resolve);
                if(resolve == null || resolve.length <= 0){
                    console.log('User Data Not Found');
                    resol  ({ok:2});
                }
               else {
                    console.log('Super Found now wait for token');
                    let token = gettoken(obj.username);
                    console.log('Token is: ',token);
                    superuser.updatetoken({'username':username,'token':token}).then((resolv)=>{
                        console.log('Update Result: '+ resolv);
                        let senddata = {
                                ok:1,
                                tokenid: token,
                                name: resolv.name,
                                username: resolv.username
                        };
                        resol (senddata);
                    }).catch((reject)=>{
                        console.log('Reject due to update token');
                        rej( {ok:3} );
                    })
                }
            }).catch((reject)=>{
                console.log('Error in superlogin');
                rej( {ok:3});
            })
        });    
       
    }
}
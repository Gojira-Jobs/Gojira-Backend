var superuser = require('../databasefunction/superuserdatabase.js');
var admin = require('../databasefunction/admindatabase.js');
var User = require('../databasefunction/userdatabase.js');
exports.superauth = (req,res,next)=> {
    console.log('Inside Super-User Authentication Function');
    if(!req.headers.token)  res.status(401).send({'status':0,'err':'unauthorized user'});
    else if(req.headers.token === "No") res.status(401).send({'status': 0,'err':'unauthorized user'});
    else {
         var token = req.headers.token;
         var userid = req.headers.email;
         console.log('Token and Username: '+ token,userid);
         let obj ={
            'username' : userid,
            'token' : token
         };
         superuser.findtoken(obj).then((resolve)=>{
             console.log('I am found');
             if(resolve == null || resolve.length <= 0) res.status(401).send({'success':false,'msg':'unauthorized user'});
             else{
                  console.log('Resolve Data: '+ resolve);
                  next();
                }
            }).catch((reject)=>{
             console.log('Catch Not Resolve: '+ reject);
             res.status(500).send({'status':0,'err':'Internal Server Error'});
        });
    }
}

exports.admin = (req,res,next)=>{
    console.log('Inside Admin Authentication Function');
    if(!req.headers.token)  res.status(401).send({'status':false,'err':'unauthorized user'});
    else {
         var token = req.headers.token;
         var userid = req.headers.email;
         console.log('Token and Username: '+ token,userid);
         admin.admintokenfind({'email': userid, 'token': token}).then((resolve)=>{
             if(resolve == null || resolve.length <= 0) res.status(401).send({'success':false,'msg':'unauthorized user'});
             else{
                  console.log('Resolve Data: '+ resolve);
                  next();
            }
         }).catch((reject)=>{
             console.log('Catch Not Resolve');
             res.status(500).send({'status':false,'err':'Internal Server Error'});
        });
    }
}

exports.user = (req,res,next)=>{
    console.log('Inside User Authentication Function '+ JSON.stringify(req.headers));
    if(!req.headers.token)  res.status(401).send({'status':false,'err':'unauthorized user'});
    else {
         var token = req.headers.token;
         var userid = req.headers.email;
         console.log('Token and Username: '+ token,userid);
         User.usertokenfind({'email': userid,'token':token}).then((resolve)=>{
             if(resolve == null || resolve.length <= 0) res.status(401).send({'status':0,'err':'unauthorized user'});
             else{
                  console.log('Resolve Data: '+ resolve);
                  next();
            }
         }).catch((reject)=>{
             console.log('Catch Not Resolve');
             res.status(500).send({'status':0,'err':'Internal Server Error'});
        });
    }
}
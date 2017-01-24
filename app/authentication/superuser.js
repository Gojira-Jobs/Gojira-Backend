var User = require('../modal/super_user.js');
var databasefunction = require('../databasefunction/superuserdatabase.js');
module.exports = (req,res,next)=>{
    console.log('Inside Super-User Authentication Function');
    if(!req.headers.token)  res.status(401).send({'success':false,'msg':'unauthorized user'});
    else if(!req.headers.userid)  res.status(401).send({'success':false,'msg':'Username empty'});
    else {
         var token = req.headers.token;
         var userid = req.headers.userid;
        console.log('Token and Username: '+ token,userid);
        databasefunction.findtoken(token,userid).then((resolve)=>{
             if(resolve == null) res.status(401).send({'success':false,'msg':'unauthorized user'});
             else{
                  console.log('Resolve Data: '+ resolve);
                  next();
            }
         }).catch((reject)=>{
             console.log('Catch Not Resolve');
             res.status(500).send({'success':false,'msg':'Internal Server Error'});
        });
    }
}
var express = require ('express');
var router = express.Router();
var userauth = require('../authentication/authenticate.js');
var databasefunction = require('../databasefunction/userdatabase.js');

router.use(userauth.user);


router.post('/signout',function(req,res){
    console.log('In Signout');
    let obj = {
        'email': req.headers.email.toLowerCase()
    };
    databasefunction.signout(obj).then((resolve)=>{
        if(resolve == null || resolve.length <= 0) res.status(404).send({'status':0,'err':'User not found'});
        else res.status(200).send({'status':1, 'data':'Successfully signout'});
    }).catch((reject)=>{
        console.log('Signout Error: ', reject);
        res.status(500).send({'status': 0, 'err':'Internal Server Error'});
    })
})

module.exports = router;
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var databasefunction = require('../../databasefunction/superuserdatabase.js')
router.use(bodyparser.json());
var super_modal = require('../../modal/super_user/super_user.js')
var db = mongoose.connection;
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/hr_portal_db');
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log('Connected Successfully Done To Database');
})
router.post('/login', (req,res) => {
    if(!req.headers.authenticaion) res.status(401).send({'success':false, msg:'Unauthorized user.'});
    else{
            var obj=req.body;
            var auth_info = req.headers.authenticaion;
            console.log('Row Auth Data: '+ auth_info);
            var valid_data = auth_info.split(':');
            console.log('Auth Data: '+ valid_data);
            let userid = 'superuser';
            let passwrd = "pass1234userhrportal";
            if(userid === valid_data[0] && passwrd === valid_data[1]){
                     databasefunction(obj)
                    .then((data)=>{
                        console.log('Came in then', data);
                        res.status(200).send({'success':true, msg:'Login Successfull'});
                    })
                    .catch((err)=>{
                        console.log('Came in catch', err);
                        res.status(200).send({'success':false, msg:'Login Failed'});
                    });
            }
            else res.status(401).send({'success':false, msg:'Unauthorized user.'});
        }
})

module.exports = router;
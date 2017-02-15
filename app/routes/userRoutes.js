var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var secretKey = require('../../config').secret;
var errors = require('../config');
var router = express.Router();
//var nodemailer = require('@nodemailer/pro');
let userPromises = require('../promises/userPromises');
var userauth = require('../authentication/authenticate');
var databasefunction = require('../controller/userquery');

router.route('/users')
    .get((req, res, next) => {
        console.log("fhhf");
        let getData = userPromises.getUsers();
        getData.then((docs) => {
            res.json(docs);
        }).catch((err) => {
            res.end("Can't Serve Anything..");
        })
    });


router.use(userauth.user);

router.route('/')
    .get((req, res, next) => {
        console.log("gsggs " + req.headers.email);
        let user = userPromises.searchForUser(req.headers.email);
        user.then((userdata) => {
            if (!userdata) res.json({ success: false, data: null, msg: "Not found Any DAta" });
            else {
                // userdata=JSON.parse(userdata);
                var userData = userdata.toObject();
                userData.isHr = false;
                //console.log(userData);
                console.log("userdata:" + userData);
                res.json({ success: true, data: userData, msg: "User data send" });
            }
        }).catch((err) => {
            console.log(err);
        })
    })
    .put((req, res, next) => {
        if (!req.body.email)
            res.status(errors.BADREQUEST.code).json({ msg: errors.BADREQUEST.msg });
        else {
            console.log("Put req body" + req.body);
            var updateData = userPromises.setData(req.body);
            updateData.then((data) => {
                res.status(errors.ACCEPTED.code).json({ msg: "Updation Completed", data: data });
            }).catch((err) => {
                res.status(errors.INTERNAL.code).json({ msg: errors.INTERNAL.msg })
            });

        }
    });



module.exports = router;
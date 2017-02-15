let express = require('express');
let bodyparser = require('body-parser');
let router = express.Router();
let databasefunction = require('../controller/userquery');
let nodemail = require('../helper/nodemail.js');
let tokenfun = require('../helper/jwttoken');
let url = require('../helper/linkgenerate');
let headercheck = require('../authentication/headercheck');

router.use(bodyparser());
router.use(headercheck.headerchecking);

router.post('/', function(req, res) {
    console.log('In User Registration-->');
    if (!req.body) res.satus(401).send({ 'status': 0, 'data': 'Unauthorized User' });
    else {
        let obj = req.body;
        console.log('Coming Data: ', obj);
        databasefunction.emailfind(obj).then((resol) => {
            if (resol === null) {
                console.log('Email Unique');
                obj.token = tokenfun.gettoken(obj.email);
                databasefunction.insertdata(obj).then((solv) => {
                    console.log('Insertion Done Successfully');
                    let activate_url = 'http://localhost:4200/profile?email:' + obj.email + '&token:' + obj.token;
                    let maildata = {
                        'email': obj.email,
                        'subject': 'Gojira Account Activation Link',
                        'text': 'Welcome Message',
                        'html_msg': '<h1>Welcome In Gojira Job Portal.<br> To Activate Your Account Click on Below Link</h1><h2>' + activate_url + '</h3>'
                    };
                    nodemail(maildata).then((data) => {
                        console.log('Insertion Successsfully Done');
                        res.status(200).send({ 'status': 1, 'data': 'Link send to that Account' });
                    }).catch((err) => {
                        console.log('Error due to mail transfer: ', err);
                        res.status(500).send({ 'status': 0, 'err': 'Internal Server Error!' });
                    });
                }).catch((reje) => {
                    console.log('error in insertion: ', reje);
                    res.status(500).send({ 'staus': 0, 'err': 'Internal Server Error' });
                });
            } else {
                console.log('Duplicate Email');
                res.status(422).send({ 'status': 0, 'err': 'This mail-address already exist' });
            }
        }).catch((rej) => {
            console.log('Find Error: ', rej);
            res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' });
        })
    }
})

module.exports = router;
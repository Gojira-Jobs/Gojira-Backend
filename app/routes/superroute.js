var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var superauth = require('../authentication/authenticate.js');
var databasefunction = require('../controller/superquery');
var nodemail = require('../helper/nodemail.js');

router.use(superauth.superauth);
router.use(bodyparser());

router.post('/admin-insert', function(req, res) {
    if (!req.body) res.status(422).send({ 'status': 0, 'err': 'No data present' });
    else if (req.body.email == "") res.status(422).send({ 'status': 0, 'err': 'Email Required' });
    else {
        databasefunction.adminemailcheck(req.body.email).then((resolve) => {
            console.log('Check Email');
            if (resolve === null) {
                console.log('Unique Email');
                let obj = {
                    'email': req.body.email.toLowerCase(),
                    'password': req.body.password,
                    'name': req.body.name,
                    'gender': req.body.gender,
                    'token': 'No',
                    'isHr': true
                };
                console.log('Check Email Finish');
                databasefunction.admininsert(obj).then((resolve) => {
                    console.log('Successfully Inserted');
                    let senddata = {
                        'email': obj.email,
                        'subject': 'Account Create Confermation and Account Details',
                        'msg': 'Your Userid: ' + obj.email + 'and Password: ' + obj.password,
                        'html_msg': '<b><h1>Welcome to Hr Portal</h1><h3>Use below information for first time login</h3><h4>Userid: ' + obj.email + ' and Password: ' + obj.password + '</h4></b>'
                    };
                    console.log(senddata);
                    console.log(nodemail);
                    nodemail(senddata).then((resolve) => {
                        console.log('Email Send');
                        res.status(200).send({ 'status': 1, 'data': 'Inserted Successfully' });
                    }).catch((reject) => {
                        console.log('Error due to mail sending but data inerted');
                        res.status(500).send({ 'status': 0, 'err': 'Mail not send due to internal error but account created' });
                    })
                }).catch((err) => {
                    console.log('Insertion Error: ', err);
                    res.status(500).send({ 'status': 0, 'err': 'Internal server error due to insertion' });
                });
            } else {
                console.log('Duplicate Email');
                res.status(422).send({ 'status': 0, 'err': 'Duplicate email' });
            }
        }).catch((err) => {
            console.log('Error due to search email', err);
            res.status(500).send({ 'status': 0, 'err': 'Internal error due search email' });
        });
    }
})

router.post('/admin-delete', function(req, res) {
    console.log('Inside Delete Function');
    if (!req.body) res.status(400).send({ 'success': false, 'data': 'Empty data' });
    else if (req.body.email === null || req.body.email == "") res.status(400).send({ 'status': 0, 'err': 'Email Required' });
    else {
        let email = req.body.email.toLowerCase();
        console.log('Username' + email);
        databasefunction.admindelete(email).then((resolve) => {
            console.log('Deletion done:' + resolve);
            if (resolve == null) res.status(404).send({ 'status': 0, 'err': 'User Not Found' });
            else res.status(200).send({ 'status': 1, 'data': 'Deletion Done' });
        }).catch((reject) => res.status(500).send({ 'status': 0, 'err': 'Internal server error' }))
    }
})

router.post('/admin-list', function(req, res) {
    console.log('In Admin List Post');
    databasefunction.adminlist().then((resolve) => {
        if (resolve == null) res.status(404).send({ 'status': 0, 'err': 'List is empty' });
        else res.status(200).send({ 'status': 1, 'data': resolve });
    }).catch((reject) => {
        console.log('Error Due To Retrive Data..');
        res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' });
    });
})

router.post('/change', function(req, res) {
    console.log('Change Password Module');
    if (!req.body) res.status(400).send({ 'success': false, 'data': 'Empty data' });
    else if (req.body.oldpassword == null || req.body.oldpassword == "") res.status(400).send({ 'status': 0, 'err': 'Password Required' });
    else if (req.body.newpassword == null || req.body.newpassword == "") res.status(400).send({ 'status': 0, 'err': 'Password Required' });
    else {
        let obj = {
            'username': req.headers.email.toLowerCase(),
            'oldpass': req.body.oldpassword,
            'newpass': req.body.newpassword
        };
        databasefunction.passwordchange(obj).then((resolve) => {
            if (resolve === null) res.status(404).send({ 'status': 0, 'err': 'User Not Found' });
            else res.status(200).send({ 'status': 1, 'data': 'password change successfully' });
        })

    }
})

router.post('/signout', function(req, res) {
    console.log('In Signout');
    let obj = {
        'username': req.headers.email.toLowerCase()
    };
    databasefunction.signout(obj).then((resolve) => {
        if (resolve === null) res.status(404).send({ 'status': 0, 'err': 'User not found' });
        else res.status(200).send({ 'status': 1, 'data': 'Successfully signout' });
    }).catch((reject) => {
        console.log('Signout Error: ', reject);
        res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' });
    })
})


module.exports = router;
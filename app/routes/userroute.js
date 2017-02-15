let express = require('express');
let router = express.Router();
let userauth = require('../authentication/authenticate.js');
let databasefunction = require('../controller/userquery');
let verifyaccount = require('../controller/emailverify');
let tokenfun = require('../helper/jwttoken');
let nodemail = require('../helper/nodemail');

router.post('/signout', userauth.user, function(req, res) {
    console.log('In User Signout ' + req.body.email);
    let obj = {
        'email': req.headers.email.toLowerCase()
    };
    databasefunction.signout(obj).then((resolve) => {
        if (resolve == null || resolve.length <= 0) res.status(404).send({ 'status': 0, 'err': 'User not found' });
        else res.status(200).send({ 'status': 1, 'data': 'Successfully signout' });
    }).catch((reject) => {
        console.log('Signout Error: ', reject);
        res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' });
    })
})

router.post('/reset', userauth.user, function(req, res) {
    let obj = {
        'email': req.headers.email,
        'token': "No",
        'password': req.body.password,
    };
    databasefunction.passwordreset(obj).then(data => res.status(200).send({ 'status': 1, 'data': 'Password Successfully Set' }))
        .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
})
router.post('/verified', function(req, res) {
    if (!req.headers.token) res.status(422).send({ 'status': 0, 'err': 'Provide Information' })
    else if (!req.headers.email) res.status(422).send({ 'status': 0, 'err': 'Provide Information' })
    else {
        let obj = {
            'email': req.headers.email,
            'token': req.headers.token
        };
        verifyaccount(obj).then((data) => {
                if (data.ok == 1) res.status(200).send({ 'status': 1, 'data': data })
                else if (data.ok == 2) res.status(404).send({ 'status': 0, 'err': 'Account Not Found' })
                else res.status(422).send({ 'status': 2, 'err': 'Activation Link Timeout' })
            })
            .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
    }
})
router.post('/resendlink', function(req, res) {
    if (!req.headers.authheader) res.status(422).send({ 'status': 0, 'err': 'Provide Information' });
    else {
        let headerinfo = req.headers.authheader;
        header_info = headerinfo.split('-');
        if (header_info[0] == 'hrportalgojirabackend' && header_info[1] == 'bprrsa@1234') {
            let obj = {
                'email': req.body.email
            };
            databasefunction.emailfind(obj).then((solv) => {
                if (solv) {
                    obj.token = tokenfun.gettoken(obj.email);
                    databasefunction.usertokenupdate(obj).then(data => {
                            let activate_url = 'http://localhost:4200/profile?email=' + obj.email + '&token=' + obj.token;
                            let maildata = {
                                'email': obj.email,
                                'subject': 'Gojira Account Activation Link',
                                'text': 'Welcome Message',
                                'html_msg': '<h1>Welcome In Gojira Job Portal.<br> To Activate Your Account Click on Below Link and Valid For 1Hour</h1><h2>' + activate_url + '</h3>'
                            };
                            nodemail(maildata).then(send => res.status(200).send({ 'status': 1, 'data': 'Activation Link Send' }))
                                .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))

                        })
                        .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
                } else res.status(404).send({ 'status': 0, 'err': 'User Not Found' })
            }).catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
        } else res.status(401).send({ 'status': 0, 'err': 'Unauthorized User' });
    }
})

module.exports = router;
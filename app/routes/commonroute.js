let express = require('express');
let router = express.Router();
let bodyparser = require('body-parser');
let logfunction = require('../controller/login');
let forget = require('../controller/forgetlink');
let headercheck = require('../authentication/headercheck');
let gettoken = require('../helper/jwttoken');
let nodemail = require('../helper/nodemail');
router.use(headercheck.headerchecking);
router.use(bodyparser());

router.post('/', function(req, res) {

    console.log(req.body.email, req.body.password, req.body.isHr);
    let obj = {
        'email': req.body.email,
        'password': req.body.password
    };
    if (req.body.isHr == true) {
        console.log('User is HR');
        logfunction.adminlogin(obj).then((resolve) => {
            console.log('Data are: ' + resolve);
            if (resolve.ok === 1) {
                console.log('Login Successfully Done..');
                console.log('Resolve Token' + resolve.user.token);
                res.status(200).send(resolve.user);
            } else {
                console.log('Userid or Password not match');
                res.status(401).send({ 'status': 0, 'err': 'Unauthorized User' });
            }
        }).catch((rej) => {
            console.log('Internal Error');
            res.status(500).send({ 'status': 0, 'data': 'Internal Error' });
        })
    } else {
        console.log('User is User');
        logfunction.userlogin(obj).then((resolve) => {
            console.log('Data are: ' + resolve);
            if (resolve.ok === 1) {
                console.log('Login Successfully Done..');
                console.log('Resolve Token ' + resolve.user.token);
                res.status(200).send(resolve.user);
            } else if (resolve.ok == 0) res.status(422).send({ 'status': 5, 'err': 'Please Verify your email, after that you can login' })
            else {
                console.log('Userid or Password not match');
                res.status(401).send({ 'status': 0, 'err': 'Userid or Password Not Match' });
            }

        }).catch((reject) => {
            console.log('Internal Error');
            res.status(500).send({ 'status': 0, 'err': 'Internal Error' });
        })
    }
})

router.post('/forget', function(req, res) {
    if (!req.body) res.status(422).send({ 'status': 0, 'err': 'Provide Data' })
    if (!req.body.email) res.status(422).send({ 'status': 0, 'err': 'Provide email' })
    else {
        if (req.body.isHr == true) {
            forget.adminforget({ 'email': req.body.email }).then((solve) => {
                if (solve.ok == 1) {
                    let url = 'http://localhost:4200/forgetpass?email=' + req.body.email.trim().toLowerCase() + '&token=' + solve.token;
                    let senddata = {
                        'email': req.body.email,
                        'subject': 'Password Reset Link',
                        'msg': 'Use Below link to reset password and Valid For One Hour',
                        'html_msg': '<h1>Use Given Link To Reset Your Password and It will Valid For 1 Hour</h1><h2>' + url + '</h2>'
                    };
                    nodemail(senddata).then(resolve => res.status(200).send({ 'status': 1, 'data': 'Reset Link send' }))
                        .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
                } else res.status(404).send({ 'status': 0, 'err': 'User Not Found' })
            }).catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
        } else {
            forget.userforget({ 'email': req.body.email }).then((solve) => {
                console.log('In Then->');
                if (solve.ok == 1) {
                    let url = 'http://localhost:4200/forgetpass?email=' + req.body.email.trim().toLowerCase() + '&token=' + solve.token;
                    let senddata = {
                        'email': req.body.email,
                        'subject': 'Password Reset Link',
                        'msg': 'Use Below link to reset password and Valid For One Hour',
                        'html_msg': '<h1>Use Given Link To Reset Your Password and It will Valid For 1 Hour</h1><h2>' + url + '</h2>'
                    };
                    nodemail(senddata).then(resolve => res.status(200).send({ 'status': 1, 'data': 'Reset Link send' }))
                        .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
                } else res.status(404).send({ 'status': 0, 'err': 'User Not Found' })
            }).catch(err => {
                console.log('Error=> ', err);
                res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' })
            })
        }
    }
})

module.exports = router;
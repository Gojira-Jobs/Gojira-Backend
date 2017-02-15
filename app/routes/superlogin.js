var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var logfunction = require('../controller/login');
let headercheck = require('../authentication/headercheck');

router.use(headercheck.headerchecking);
router.use(bodyparser());

router.post('/', function(req, res) {
    console.log('Header Found');
    let username = req.body.email.toLowerCase();
    let password = req.body.password;
    console.log(username, password);
    logfunction.superlogin(username, password).then((resolve) => {
        console.log('Data are: ' + resolve);
        if (resolve.ok === 1) {
            console.log('Login Successfully Done..');
            console.log('Resolve Token' + resolve.tokenid);
            let senddata = {
                token: resolve.tokenid,
                name: resolve.name,
                username: resolve.username
            };
            res.status(200).send({ 'status': 1, 'data': senddata });
        } else {
            console.log('Userid and Password not match');
            res.status(200).send({ 'status': 0, 'data': 'Userid or Password not match' });
        }
    }).catch((reject) => {
        console.log('Internal Error');
        res.status(500).send({ 'status': false, 'data': 'Internal Server Error' });
    })
})
module.exports = router;
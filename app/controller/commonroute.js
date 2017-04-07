let logfunction = require('../services/login');
let forget = require('../services/forgetlink');
let gettoken = require('../services/jwttoken');
let nodemail = require('../services/nodemail');
let postPromises = require('../promises/postPromises');
let errors = require("../config");
let hrdatabasefunction = require('../helper/hrquery');
let userdatabasefunction = require('../helper/userquery');


module.exports = {
    login: (req, res, next) => {
        let obj = {
            'email': req.body.email,
            'password': req.body.password
        };
        if (req.body.isHr == true) {
            console.log('User is HR');
            logfunction.adminlogin(obj).then((resolve) => {
                    if (resolve.ok === 1) res.status(200).send(resolve.user);
                    else res.status(401).send({ 'status': 0, 'err': 'Unauthorized User' })
                })
                .catch(rej => res.status(500).send({ 'status': 0, 'data': 'Internal Error' }))
        } else {
            console.log('User is User');
            logfunction.userlogin(obj).then((resolve) => {
                    if (resolve.ok === 1) res.status(200).send(resolve.user)
                    else if (resolve.ok == 0) res.status(422).send({ 'status': 5, 'err': 'Please Verify your email, after that you can login' })
                    else res.status(401).send({ 'status': 0, 'err': 'Userid or Password Not Match' })
                })
                .catch(reject => res.status(500).send({ 'status': 0, 'err': 'Internal Error' }))
        }
    },

    forget: (req, res, next) => {
        if (!req.body) res.status(422).send({ 'status': 0, 'err': 'Provide Data' })
        if (!req.body.email) res.status(422).send({ 'status': 0, 'err': 'Provide email' })
        else {
            if (req.body.isHr == true) {
                forget.adminforget({ 'email': req.body.email }).then((solve) => {
                    if (solve.ok == 1) {
                        let url = 'http://f6a75801.ngrok.io/forgotpass?email=' + req.body.email.trim().toLowerCase() + '&token=' + solve.token+'&H='+true;
                        let senddata = {
                            'email': req.body.email,
                            'subject': 'Password Reset Link',
                            'msg': 'Use Below link to reset password and Valid For One Hour',
                            'html_msg': '<h1>Use Given Link To Reset Your Password and It will Valid For 1 Hour</h1><h2>' + url + '</h2>'
                        };
                        nodemail(senddata).then(resolve => res.status(200).send({ 'status': 1, 'data': 'Password Reset Link send to your registered email. Kindly visit the link to reset your password.' }))
                            .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
                    } else res.status(404).send({ 'status': 0, 'err': 'Email not registered with us. Kindly Signup or check email.' })
                }).catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
            } else {
                forget.userforget({ 'email': req.body.email }).then((solve) => {
                    if (solve.ok == 1) {
                        let url = 'http://localhost:4200/forgotpass?email=' + req.body.email.trim().toLowerCase() + '&token=' + solve.token+'&H='+false;
                        let senddata = {
                            'email': req.body.email,
                            'subject': 'Password Reset Link',
                            'msg': 'Use Below link to reset password and Valid For One Hour',
                            'html_msg': '<h1>Use Given Link To Reset Your Password and It will Valid For 1 Hour</h1><h2>' + url + '</h2>'
                        };
                        nodemail(senddata).then(resolve => res.status(200).send({ 'status': 1, 'data': 'Password Reset Link send to your registered email. Kindly visit the link to reset your password.' }))
                            .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
                    } else res.status(404).send({ 'status': 0, 'err': 'Email not registered with us. Kindly Signup or check email.' })
                }).catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
            }
        }
    },

    passwordchange: (req, res, next) => {
        console.log("Inside Password Match Apply>>>>>> ",req.body);
        let obj = {
            'email': req.headers.email,
            'token': req.headers.token,
            'oldPass': req.body.oldPass,
            'isHr': req.body.isHr,
            'newPass':req.body.newPass
        };
        console.log(obj);
        let match = postPromises.passwordMatch(obj);
        match.then((user) => {
            if (user) {
                if (obj.isHr){
                    let changePass= hrdatabasefunction.passwordchange(obj);
                    changePass.then((data)=>{
                        res.status(errors.CREATED.code).json({ status: 1, user: data })
                    }).catch((err) => {
                        console.log('In Error1');
                        if (err == null || err == undefined) res.status(errors.BADREQUEST.code).json({ status: 0, msg: "Old Password is not correct" });
                        else res.status(errors.BADREQUEST.code).json({ status: 0, msg: errors.BADREQUEST.msg });
                    })
                }
                else{
                    let changePass= userdatabasefunction.passwordchange(obj);
                    changePass.then((data)=>{
                        res.status(errors.CREATED.code).json({ status: 1, user: data })
                    }).catch((err) => {
                        console.log('In Error1');
                        if (err == null || err == undefined) res.status(errors.BADREQUEST.code).json({ status: 0, msg: "Old Password is not correct" });
                        else res.status(errors.BADREQUEST.code).json({ status: 0, msg: errors.BADREQUEST.msg });
                    })
                }
            } 
            else res.status(errors.CREATED.code).json({ status: 0, msg: "Old Password is not correct" })
        }).catch((err) => {
            console.log('In Error1');
            if (err == null || err == undefined) res.status(errors.BADREQUEST.code).json({ status: 0, msg: "Old Password is not correct" });
            else res.status(errors.BADREQUEST.code).json({ status: 0, msg: errors.BADREQUEST.msg });
        })
    }
}
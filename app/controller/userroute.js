let databasefunction = require('../helper/userquery');
let nodemail = require('../services/nodemail');
let tokenfun = require('../services/jwttoken');
let verifyaccount = require('../services/emailverify');
let errors = require('../config');
let userPromises = require('../promises/userPromises');
module.exports = {
    registration: (req, res, next) => {
        if (!req.body) res.satus(401).send({ 'status': 0, 'data': 'Unauthorized User' });
        else {
            let obj = req.body;
            databasefunction.emailfind(obj).then((resol) => {
                if (resol === null) {
                    obj.token = tokenfun.gettoken(obj.email);
                    databasefunction.insertdata(obj).then((solv) => {
                        let activate_url = 'http://localhost:4200/profile?email=' + obj.email + '&token=' + obj.token;
                        let maildata = {
                            'email': obj.email,
                            'subject': 'Gojira Account Activation Link',
                            'text': 'Welcome Message',
                            'html_msg': '<h1>Welcome In Gojira Job Portal.<br> To Activate Your Account Click on Below Link and Valid For 1Hour</h1><h2>' + activate_url + '</h3>'
                        };
                        nodemail(maildata).then((data) => res.status(200).send({ 'status': 1, 'data': 'Link send to that Account' }))
                            .catch((err) => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error!' }))
                    }).catch(reje => res.status(500).send({ 'staus': 0, 'err': 'Internal Server Error' }))
                } else res.status(422).send({ 'status': 0, 'err': 'This mail-address already exist' })
            }).catch((rej) => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
        }
    },

    verifyaccount: (req, res, next) => {
        if (!req.headers.token) res.status(422).send({ 'status': 0, 'err': 'Provide Information' })
        else if (!req.headers.email) res.status(422).send({ 'status': 0, 'err': 'Provide Information' })
        else {
            let obj = {
                'email': req.headers.email,
                'token': req.headers.token
            };
            verifyaccount(obj).then((data) => {
                    if (data.ok == 1) res.status(200).send({ 'status': 1, 'data': data })
                    else if (data.ok == 0) res.status(404).send({ 'status': 0, 'err': 'Account Not Found' })
                    else res.status(422).send({ 'status': 2, 'err': 'Activation Link Timeout' })
                })
                .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
        }
    },

    resendlink: (req, res, next) => {
        if (!req.headers.authheader) res.status(422).send({ 'status': 0, 'err': 'Provide Information' });
        else {
            let headerinfo = req.headers.authheader;
            header_info = headerinfo.split('-');
            if (header_info[0] == 'hrportalgojirabackend' && header_info[1] == 'bprrsa@1234') {
                let obj = {
                    'email': req.body.email
                };
                databasefunction.emailfind(obj).then((solv) => {
                    if (solv == null || solv.length <= 0) res.status(404).send({ 'status': 0, 'err': 'User Not Found' })
                    else {
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
                    }
                }).catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
            } else res.status(401).send({ 'status': 0, 'err': 'Unauthorized User' });
        }
    },

    signout: (req, res, next) => {
        let obj = {
            'email': req.headers.email.toLowerCase()
        };
        databasefunction.signout(obj).then((resolve) => {
            if (resolve == null || resolve.length <= 0) res.status(404).send({ 'status': 0, 'err': 'User not found' });
            else res.status(200).send({ 'status': 1, 'data': 'Successfully signout' });
        }).catch((reject) => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
    },

    resetpassword: (req, res, next) => {
        let obj = {
            'email': req.headers.email,
            'token': "No",
            'password': req.body.password,
        };
        databasefunction.passwordreset(obj).then((data) => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 0, 'err': 'User Not Found' })
                else res.status(200).send({ 'status': 1, 'data': 'Password Successfully Set' })
            })
            .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
    },

    userdetails: (req, res, next) => {
        console.log("fhhf");
        let getData = userPromises.getUsers();
        getData.then((docs) => {
                res.json(docs);
            })
            .catch((err) => res.end("Can't Serve Anything.."))
    },

    userprofiledetail: (req, res, next) => {
        console.log("gsggs " + req.headers.email);
        let user = userPromises.searchForUser(req.headers.email);
        user.then((userdata) => {
            if (!userdata) res.json({ success: false, data: null, msg: "Not found Any DAta" });
            else {
                var userData = userdata.toObject();
                userData.isHr = false;
                console.log("userdata:" + userData);
                res.json({ success: true, data: userData, msg: "User data send" });
            }
        }).catch((err) => console.log(err))
    },

    userprofileedit: (req, res, next) => {
        if (!req.body.email) res.status(errors.BADREQUEST.code).json({ msg: errors.BADREQUEST.msg });
        else {
            console.log("Put req body" + req.body);
            let updateData = userPromises.setData(req.body);
            updateData.then((data) => res.status(errors.ACCEPTED.code).json({ msg: "Updation Completed", data: data }))
                .catch((err) => res.status(errors.INTERNAL.code).json({ msg: errors.INTERNAL.msg }))
        }
    }

}
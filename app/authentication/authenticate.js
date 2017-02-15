let superuser = require('../controller/superquery');
let admin = require('../controller/hrquery.js');
let User = require('../controller/userquery.js');
let tokenfun = require('../helper/jwttoken');

module.exports = {
    superauth: (req, res, next) => {
        if (!req.headers.token) res.status(401).send({ 'status': false, 'err': 'unauthorized user' });
        else if (!req.headers.email) res.status(401).send({ 'status': false, 'err': 'unauthorized user' });
        else if (req.headers.token == 'No') res.status(401).send({ 'status': 0, 'err': 'Unauthorized User' })
        let obj = {
            'username': req.body.email,
            'token': req.body.username
        };
        superuser.findtoken(obj).then((resolve) => {
            console.log('TOKEN SEARCH DONE->>>');
            if (resolve == null || resolve.length <= 0) res.status(401).send({ 'status': 0, 'err': 'Unauthorized user' });
            else {
                console.log('TOKEN FOUND->>>');
                tokenfun.verifytoken(obj).then((solv) => {
                    if (solv.verify == 0) {
                        obj.token = tokenfun.gettoken(obj.username);
                        superuser.updatetoken(obj).then(data => res.status(200).send({ 'status': 4, 'token': obj.token }))
                            .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
                    } else {
                        next();
                    }
                }).catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
            }
        }).catch((reject) => {
            console.log('Catch Not Resolve: ' + reject);
            res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' });
        });
    },

    admin: (req, res, next) => {
        console.log('Inside Admin Authentication Function');
        if (!req.headers.token) res.status(401).send({ 'status': false, 'err': 'unauthorized user' });
        else if (!req.headers.email) res.status(401).send({ 'status': false, 'err': 'unauthorized user' });
        else if (req.headers.token == 'No') res.status(401).send({ 'status': 0, 'err': 'Unauthorized User' })
        else {
            let obj = {
                'email': req.headers.email,
                'token': req.headers.token
            };
            admin.admintokenfind(obj).then((resolve) => {
                if (resolve == null || resolve.length <= 0) res.status(401).send({ 'success': false, 'msg': 'unauthorized user' });
                else {
                    console.log('HR Found->>>');
                    tokenfun.verifytoken(obj).then((solve) => {
                        if (solve.verify == 0) {
                            obj.token = tokenfun.gettoken(obj.email);
                            admin.admintokenupdate().then(data => res.status(200).send({ 'status': 4, 'token': obj.token }))
                                .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
                        } else {
                            next();
                        }
                    }).catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
                }
            }).catch((reject) => {
                console.log('Catch Not Resolve');
                res.status(500).send({ 'status': false, 'err': 'Internal Server Error' });
            });
        }
    },

    user: (req, res, next) => {
        console.log('Inside User Authentication Function ' + JSON.stringify(req.headers));
        if (!req.headers.token) res.status(401).send({ 'status': 0, 'err': 'Unauthorized user' })
        else if (!req.headers.email) res.status(401).send({ 'status': 0, 'err': 'Unauthorized user' })
        else if (req.headers.token == 'No') res.status(401).send({ 'status': 0, 'err': 'Unauthorized User' })
        else {
            let obj = {
                'email': req.headers.email,
                'token': req.headers.token
            };
            User.usertokenfind(obj).then((resolve) => {
                if (resolve == null || resolve.length <= 0) res.status(401).send({ 'status': 0, 'err': 'unauthorized user' });
                else {
                    console.log('User Found:');
                    tokenfun.verifytoken(obj).then((solv) => {
                        if (solv.verify == 0) {
                            obj.token = tokenfun.gettoken(obj.email);
                            User.usertokenupdate(obj).then(data => res.status(200).send({ 'status': 4, 'token': obj.token }))
                                .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
                        } else {
                            console.log('Authenticate..');
                            next();
                        }
                    }).catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
                }
            }).catch((reject) => {
                console.log('Catch Not Resolve', reject);
                res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' });
            });
        }
    }
}
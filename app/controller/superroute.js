let logfunction = require('../services/login');
let databasefunction = require('../helper/superquery');
let nodemail = require('../services/nodemail');

module.exports = {
    login: (req, res, next) => {
        let username = req.body.email.toLowerCase();
        let password = req.body.password;
        logfunction.superlogin(username, password).then((resolve) => {
            console.log('Data are: ' + resolve);
            if (resolve.ok === 1) {
                console.log('Login Successfully Done..');
                let senddata = {
                    token: resolve.token,
                    name: resolve.name,
                    username: resolve.username
                };
                res.status(200).send({ 'status': 1, 'data': senddata });
            } else res.status(200).send({ 'status': 0, 'data': 'Userid or Password not match' })
        }).catch(reject => res.status(500).send({ 'status': false, 'data': 'Internal Server Error' }))
    },

    admininsert: (req, res, next) => {
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
    },

    admindelete: (req, res, next) => {
        if (!req.body) res.status(400).send({ 'success': false, 'data': 'Empty data' });
        else if (req.body.email === null || req.body.email == "") res.status(400).send({ 'status': 0, 'err': 'Email Required' });
        else {
            let email = req.body.email.toLowerCase();
            databasefunction.admindelete(email).then((resolve) => {
                if (resolve == null) res.status(404).send({ 'status': 0, 'err': 'User Not Found' });
                else res.status(200).send({ 'status': 1, 'data': 'Deletion Done' });
            }).catch((reject) => res.status(500).send({ 'status': 0, 'err': 'Internal server error' }))
        }
    },

    adminlist: (req, res, next) => {
        databasefunction.adminlist().then((resolve) => {
                if (resolve == null) res.status(404).send({ 'status': 0, 'err': 'List is empty' });
                else res.status(200).send({ 'status': 1, 'data': resolve });
            })
            .catch((reject) => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }));
    },

    changepassword: (req, res, next) => {
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
                .catch(reject => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
        }
    },

    signout: (req, res, next) => {
        console.log('In Signout');
        let obj = {
            'username': req.headers.email.toLowerCase()
        };
        databasefunction.signout(obj).then((resolve) => {
                if (resolve === null) res.status(404).send({ 'status': 0, 'err': 'User not found' });
                else res.status(200).send({ 'status': 1, 'data': 'Successfully signout' });
            })
            .catch((reject) => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
    }
}
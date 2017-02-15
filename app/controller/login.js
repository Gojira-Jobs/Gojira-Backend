let superuser = require('../controller/superquery');
let admin = require('../controller/hrquery');
let user = require('../controller/userquery');
let tokenfun = require('../helper/jwttoken');

module.exports = {
    adminlogin: (obj) => {
        return new Promise((resol, rej) => {
            console.log('HR Promise Enter-->');
            admin.adminlogin(obj).then((resolve) => {
                if (resolve == null || resolve.length <= 0) {
                    console.log('Data Not Found');
                    resol({ ok: 2 });
                } else {
                    console.log('HR Found now wait for token');
                    let token = tokenfun.gettoken(obj.email);
                    console.log('Token is: ', token);
                    admin.admintokenupdate({ 'email': obj.email, 'token': token }).then((resolv) => {
                        console.log('Update Result: ' + resolv);
                        resolv.token = token;
                        let senddata = {
                            ok: 1,
                            user: resolv
                        };
                        console.log('From Login send data: ' + senddata);
                        resol(senddata);
                    }).catch((reject) => {
                        console.log('Reject due to update token:', reject);
                        rej({ ok: 3 });
                    })
                }
            }).catch((reject) => {
                console.log('Error in adminlogin');
                rej({ ok: 3 });
            })
        });
    },

    userlogin: (obj) => {
        return new Promise((resol, rej) => {
            console.log('User Promise Enter');
            user.userlogin(obj).then((resolve) => {
                console.log('Resolve:', resolve);
                if (resolve == null || resolve.length <= 0) {
                    console.log('User Data Not Found');
                    resol({ ok: 2 });
                } else {
                    console.log('User Fond now wait for token');
                    if (resolve.verify == 'Yes') {
                        let token = tokenfun.gettoken(obj.email);
                        console.log('Token is: ', token);
                        user.usertokenupdate({ 'email': obj.email, 'token': token }).then((resolv) => {
                            console.log('Update Result: ' + resolv);
                            resolv.token = token;
                            let senddata = {
                                ok: 1,
                                user: resolv
                            };
                            resol(senddata);
                        }).catch((reject) => {
                            console.log('Reject due to update token');
                            rej({ ok: 3 });
                        })
                    } else {
                        resol({ 'ok': 0 })
                    }
                }
            }).catch((reject) => {
                console.log('Error in userlogin');
                rej({ ok: 3 });
            })
        });

    },

    superlogin: (username, password) => {
        return new Promise((resol, rej) => {
            console.log('Super Promise Enter');
            let obj = {
                'username': username,
                'password': password
            };
            superuser.superlogin(obj).then((resolve) => {
                console.log('Resolve:', resolve);
                if (resolve == null || resolve.length <= 0) {
                    console.log('User Data Not Found');
                    resol({ ok: 2 });
                } else {
                    console.log('Super Found now wait for token');
                    let token = tokenfun.gettoken(obj.username);
                    console.log('Token is: ', token);
                    superuser.updatetoken({ 'username': username, 'token': token }).then((resolv) => {
                        console.log('Update Result: ' + resolv);
                        let senddata = {
                            ok: 1,
                            token: token,
                            name: resolv.name,
                            username: resolv.username
                        };
                        resol(senddata);
                    }).catch((reject) => {
                        console.log('Reject due to update token');
                        rej({ ok: 3 });
                    })
                }
            }).catch((reject) => {
                console.log('Error in superlogin');
                rej({ ok: 3 });
            })
        });

    }
}
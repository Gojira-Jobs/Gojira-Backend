let admin = require('./hrquery');
let user = require('./userquery');
let tokenfun = require('../helper/jwttoken');

module.exports = {
    adminforget: (obj) => {
        return new Promise((solve, reject) => {
            admin.emailfind(obj).then((resolve) => {
                if (resolve) {
                    obj.token = tokenfun.gettoken(obj.email);
                    admin.admintokenupdate(obj).then(data => solve({ 'ok': 1, 'token': obj.token }))
                        .catch(err => reject(err))
                } else solve({ 'ok': 0 })
            }).catch(err => reject(err))
        })
    },
    userforget: (obj) => {
        return new Promise((solve, reject) => {
            user.emailfind(obj).then((resolve) => {
                console.log('ok==>>>');
                if (resolve != null || resolve.length > 0) {
                    obj.token = tokenfun.gettoken(obj.email);
                    user.usertokenupdate(obj).then(data => solve({ 'ok': 1, 'token': obj.token }))
                        .catch(err => reject(err))
                } else solve({ 'ok': 0 })
            }).catch(err => reject(err))
        })
    }
}
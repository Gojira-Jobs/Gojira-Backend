let user = require('../helper/userquery');
let tokenfun = require('./jwttoken');

module.exports = function(obj) {
    return new Promise((resolve, reject) => {
        console.log("Inside email verify method>>>>>>>>>>>>>>>>>>>>>>>>>>");
        user.usertokenfind(obj).then((solve) => {
            console.log("Verifying token>>>>>>>>>>>>>>>>>>>>>>>>>>");
                if (solve == null || solve.length <= 0) resolve({ 'ok': 0 });
                else {
                    tokenfun.verifytoken(obj).then((info) => {
                        if (info.verify == 1) {
                            console.log("Token verified>>>>>>>>>>>>>>>>>>>>>>>>>>");
                            obj.ntoken = tokenfun.gettoken(obj.email);
                            user.useremailverify(obj).then(data => {
                                    if (data) {
                                        data.token = obj.ntoken;
                                        data.ok = 1;
                                        console.log("Token set on email>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                        resolve(data);
                                    } else resolve({ 'ok': 2 })
                                })
                                .catch(err => reject(err))
                        } else resolve({ 'ok': 2 })
                    }).catch(err => reject(err))
                }
            })
            .catch(err => reject(err))
    })
}
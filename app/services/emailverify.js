let user = require('./userquery');
let tokenfun = require('../helper/jwttoken');

module.exports = function(obj) {
    return new Promise((resolve, reject) => {
        user.usertokenfind(obj).then((solve) => {
                if (solve == null || solve.length <= 0) resolve({ 'ok': 0 });
                else {
                    tokenfun.verifytoken(obj).then((info) => {
                        if (info.verify == 1) {
                            obj.ntoken = tokenfun.gettoken(obj.email);
                            user.useremailverify(obj).then(data => {
                                    if (data) {
                                        data.token = obj.ntoken;
                                        data.ok = 1;
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
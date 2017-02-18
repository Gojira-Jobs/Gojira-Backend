let user = require('../helper/userquery');
module.exports = (obj) => {
    return new Promise((resolve, reject) => {
        user.emailfind(obj).then(data => {
            console.log('Object: ', obj);
            if (data == null || data.length <= 0) {
                user.insertdata(obj).then(result => {
                    console.log('Insertion');
                    result.token = obj.token;
                    resolve({ 'ok': 2, 'data': result });
                }).catch(err => {
                    console.log('Insert err: ', err);
                    reject(err);
                })
            } else {
                user.usertokenupdate(obj).then((result) => {
                    result.token = obj.token;
                    console.log('Google Data Search Function', obj);
                    resolve({ 'ok': 1, 'data': result });
                }).catch((err) => {
                    console.log('Update err', err);
                    reject(err);
                })
            }
        }).catch(err => reject(err))
    })
}
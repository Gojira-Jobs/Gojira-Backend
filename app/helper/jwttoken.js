let jwt = require('jsonwebtoken');

module.exports = {
    gettoken: (obj) => {
        console.log('In Json Web Token' + obj);
        return (token = jwt.sign({
            username: obj
        }, 'hrportalproject', {
            expiresIn: (60 * 60)
        }));
    },
    verifytoken: (obj) => {
        console.log('Check Token..');
        return new Promise((resolve, reject) => {
            jwt.verify(obj.token, 'hrportalproject', (err, decode) => {
                if (err) {
                    console.log('Error: ', err);
                    if (err.name == 'TokenExpiredError') resolve({ 'verify': 0 });
                    else reject(err);
                } else resolve({ 'verify': 1 });
            })
        })
    }
}
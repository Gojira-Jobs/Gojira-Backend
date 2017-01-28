var jwt = require('jsonwebtoken');

module.exports = (obj)=>{
    console.log('In Json Web Token'+ obj);
    return ( token = jwt.sign({
        username : obj
    },'ourprojetkey',{
        expiresIn: 14400
    }));
}
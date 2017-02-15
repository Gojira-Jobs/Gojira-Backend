var email = require('email-existence');
module.exports = {
check:(emails)=>{
        return new Promise((resolve,reject)=> {
            email.check(emails,function(err,res) {
                console.log('Rssssss',res);
                if(res == true) {
                    console.log('True Value');
                    resolve ('ok');
                }
                else{
                    console.log('Email Error: ', err);
                    reject(err);
                }
            });
        });
    }
}
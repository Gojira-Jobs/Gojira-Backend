const nodemailer = require('@nodemailer/pro');

module.exports = function(obj){
    return new Promise((resolve,reject)=>{
        console.log('In root to mail send file...');
        let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
             user: 'bbrocx9@gmail.com',
            pass: 'qwertyzxc'
        }
     });
     let mailOptions = {
        from: '<bbrocx9@gmail.com>', // sender address
        to: obj.email, // list of receivers
        subject: obj.subject, // Subject line
        text: obj.msg, // plain text body
        html: obj.html_msg // html body
    };
    console.log('sending function');
     transporter.sendMail(mailOptions, (error, info)=> {
         if (error) {
            console.log('Error due to send mail'+ error);
            reject(error);
         }
        else {
            console.log('Message %s sent: %s', info.messageId, info.response);
            resolve(info);
        }
     });
  });         
}
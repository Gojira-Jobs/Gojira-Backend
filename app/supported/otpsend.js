var nodemail = require('./nodemail.js');
var otp = require ('./otpgenerate.js');
var admin = require('../databasefunction/admindatabase.js');
var user = require('../databasefunction/userdatabase.js');
module.exports = (obj)=> {
	return new Promise((ok,ignor)=> {
				console.log('I am Here');
				console.log('In send mail: ', obj.email);
				let x = otp();
				if(obj.isHr == true){
					console.log('Admin OTP');
					let senddata = {
						'email': obj.email,
						'subject': 'One Time Passwor for reset your password',
						'text': 'below 4-digit code to to reset password',
						'html_msg': '<b><h1>Your Otp </h1>'+' '+'<h2>'+' '+x+' '+'</h2></b>'
					};
					admin.otpupdate({'email':obj.email,'otp':x}).then((data)=> {
						if(data == null) ok(2);
						else{
							console.log('OTP Updated.');
							nodemail(senddata).then((resolve)=> {
							console.log('Mail Send');
							ok(1);
							}).catch((reject)=> {
								console.log('Mail send error: ', reject);
								ignor('');
							})
						}
					}).catch((err)=> {
							console.log('OTP Update Error: '+ err);
							ignor('');
					})
			}
			else{
				console.log('User OTP');
				let senddata = {
					'email': obj.email,
					'subject': 'One Time Passwor for reset your password',
					'text': 'below 4-digit code to to reset password',
					'html_msg': '<b><h1>Your Otp </h1>'+' '+'<h2>'+' '+x+' '+'</h2></b>'
				};
				user.otpupdate({'email':obj.email,'otp':x}).then((data)=> {
					if(data == null) ok(2);
					else{
						console.log('OTP Updated');
						nodemail(senddata).then((resolve)=> {
							console.log('Mail Send');
							ok(1);
						}).catch((reject)=> {
							console.log('Mail send error: ', reject);
							ignor('');
						})
					} 
				}).catch((err)=> {
					console.log('OTP Update Error: '+ err);
					ignor('');
				})
			}
	});
}
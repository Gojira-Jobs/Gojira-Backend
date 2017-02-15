var admin = require('../databasefunction/admindatabase.js');
var user = require('../databasefunction/userdatabase.js');
var gettoken = require('./gettoken.js');

module.exports = {
	adminset: (obj)=> {
		return new Promise((ok,ignor)=> {
			console.log('In admin set');
			obj.token = gettoken(obj.email);
			admin.passtokenset(obj).then((resolve)=>{
				if(resolve == null){
					obj.ok = 0;
					ok(obj);
				}
				else {
					console.log('Paasword Update');
					obj.ok = 1;
					obj.name = resolve.name;
					obj.otp = 0,
					obj.password = '',
					obj.gender = resolve.gender,
					console.log(obj);
					ok(obj);
				}
			}).catch((reject)=> {
				console.log('Update Error', reject);
				ignor(' ');
			})
		})
	},

	userset: (obj)=>{
		return new Promise((ok,ignor)=> {
			console.log('In User set');
			obj.token = gettoken(obj.email);
			user.passtokenset(obj).then((resolve)=>{
				if(resolve == null){
					obj.ok = 0;
					ok(obj);
				}
				else{
					console.log('Paasword Update');
					obj.ok = 1
					obj.name = resolve.name;
					obj.otp = 0,
					obj.password = '',
					obj.phonenumber = resolve.phonenumber,
					obj.gender = resolve.gender,
					console.log(obj);
					ok(obj);	
				}
			}).catch((reject)=> {
				console.log('Update Error', reject);
				ignor(' ');
			})
		})
	}
}
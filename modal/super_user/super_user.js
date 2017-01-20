var mongoose = require('mongoose');
var schema = mongoose.Schema;
var admin_modal = new schema({
    name : {type:String, required: true},
    email : {type:String, required: true},
    phone_number : {type:String, required: true},
    password : {type:String, required: true},
    role:[{role_name:String,role_Id: String}],
    resume:{type: String, default: 'No'},
    gender: {type: String}
});
var super_user = new schema({
    uid: String,
    name: String,
    password: String,
    token:{type: String, default:'No'}
});
module.exports = mongoose.model('super_tables',super_user);
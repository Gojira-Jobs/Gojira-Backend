var mongoose = require('mongoose');
var schema = mongoose.Schema;

var user = new schema({
    email:{type: String, required:true, trim: true},
    password:{type: String, required:true},
    name: {type:String, required:true, trim:true},
    token:{type: String, default:'No'},
    otp: {type: String, default: '0'},
    gender: {type: String, required: true, trim: true},
    phonenumber: {type: String, required: true, trim: true}
});

module.exports = mongoose.model('user_tables',user);
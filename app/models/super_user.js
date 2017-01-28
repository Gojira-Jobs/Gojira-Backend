var mongoose = require('mongoose');
var schema = mongoose.Schema;
var super_user = new schema({
    uid: String,
    name: String,
    password: String,
    token:{type: String, default:'No'}
});
module.exports = mongoose.model('super_tables',super_user);
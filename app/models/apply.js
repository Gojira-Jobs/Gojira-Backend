var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let jobSchema = new Schema({
    job_id : {  type:String,
                required:true,
                trim:true},
    email : { type:String,
                required:true,
                trim:true},
    resume : { type:String,
    			required:true,
    			trim:true}
});
module.exports=mongoose.model('applications',jobSchema);
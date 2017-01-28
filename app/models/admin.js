var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let hrSchema=new Schema({
    email:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    password:{type:String,required:true},
    token: {type: String, default:'No'},
    otp: {type: String, default: 'No'}
},{versionKey:false});

let postSchema = new Schema({
    job_id:{type:String,
        trim:true,
        required:true,
        unique:true
    },
    category:{
        type:String,
        required:true,
    },
    title:{type:String,
        required:true,
    },
    description:{type:String,
        required:true
    },
    AgeLimit:{ type:String,default:"not defined"},
    WorkExp:{ type:String,default:"not defined"},
    EduDetails:{ type:String,default:"not defined"},
    last_date:{
        type:Date,
        required:true
    },
    Joining:{type:Date},
    WorkPlace:{type:String,default:"Not decided"},
    postedBy:{type:Schema.Types.ObjectId,ref:'admin'}
});
module.exports = {
    hrSchema:mongoose.model('admin_tables',hrSchema),
    postSchema:mongoose.model('post',postSchema)
};
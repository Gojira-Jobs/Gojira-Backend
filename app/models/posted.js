var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let hrSchema=new Schema({
    _id:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    password:{type:String,required:true}
});

let postSchema = new Schema({
    _id:{type:String,
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
    Joining:{type:Date,default:"Not Mentioned.."},
    WorkPlace:{type:String,default:"Not decided"},
    postedBy:{type:String,ref:'admin'}
});
exports.hrSchema=mongoose.model('admin',hrSchema);
exports.postSchema=mongoose.model('post',postSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


let userSchema = new Schema({
    name : {  type:String,
                required:true,
                trim:true},
    email : { type:String,
                required:true,
                unique:true,trim:true
            },
    password : { type:String,
                required:true,
            trim:true},
    phonenumber : { type:String,
                default:"900000000",
                trim:true
            },
    token:{type:String},
    high_qual : { type:String,
                default:"MCA",trim:true},
    high_qual_perc :{ type:Number,
                default:0},
    pursuing_status : { type:Boolean,
                default:false},
    dob : { type:String,
                default:''},
    gender :{ type:String,
                default:"Male"},
    street :{type:String,
            default:"",trim:true
            } ,
    city :{type:String,
            default:"",trim:true
            },
    state : {type:String,
            default:"",trim:true
            },
    pincode : {type:Number,
            default:0
            },
    isHr :{type:Boolean,
        default:false

    },
    resume : String,
    picture : String,
})

module.exports=mongoose.model('users',userSchema);
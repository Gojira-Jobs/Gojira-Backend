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
    mobile : { type:String,
                default:"900000000",
                unique:true,trim:true
            },
    high_qual : { type:String,
                default:"MCA",trim:true},
    high_qual_perc :{ type:Number,
                default:0},
    pursuing_status : { type:Boolean,
    default:false},
    dob : { type:Date,
                default:Date.now},
    gender :{ type:String,
                default:"Male"},
    resume : String,
    picture : String,
    address :{
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
            }
    },
    token :{
        type: String
    }
})
userSchema.virtual('userData').get(()=>{
    let st=this.name+" "+this.mobile+" "+this.email+" "+this.address.street;
    return st;
})
module.exports=mongoose.model('users',userSchema);
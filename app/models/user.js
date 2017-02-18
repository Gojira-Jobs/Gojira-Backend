let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    phonenumber: { type: String, trim: true },
    token: { type: String, default: 'No' },
    high_qual: { type: String, trim: true },
    high_qual_perc: { type: Number },
    pursuing_status: { type: Boolean },
    dob: { type: String },
    gender: { type: String, enum: ['Male', 'Female'] },
    street: { type: String, trim: true },
    isHr: { type: Boolean, default: false },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    pincode: {
        type: Number,
    },
    resume: String,
    picture: String,
    verified: {type: Boolean, default: false}
})

module.exports = mongoose.model('users', userSchema);
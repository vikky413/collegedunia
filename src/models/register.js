const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    fname : {
        type:String,
        required:true,
        unique:true
    },
    lname : {
        type:String,
        required:true,
        unique:true
    },
    
    email : {
        type:String,
        required:true,
        unique:true
    },
    
    pnumber : {
        type:String,
        required:true
    },
    stuid : {
        type:Number,
        required:true
    }

});

// Compile model from schema
const Register = mongoose.model("registerModel", userSchema);
module.exports = Register
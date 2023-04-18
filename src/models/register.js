const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    fname : {
        type:String,
        required:true,
        
    },
    lname : {
        type:String,
        required:true,
       
    },
    
    email : {
        type:String,
        required:true,
      
    },
    
    pnumber : {
        type:String,
        required:true
    },

    feedback : {
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

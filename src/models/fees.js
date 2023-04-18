const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name : {
        type:String,
        required:true,   
    },
    
    card : {
        type:String,
        required:true,   
    },
    tid : {
        type:String,
        required:true,
    },
    stuid : {
        type:Number,
        required:true
    }

});

// Compile model from schema
const feesModel = mongoose.model("feeModel", userSchema);
module.exports = feesModel

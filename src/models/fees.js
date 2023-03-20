const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    Name : {
        type:String,
        required:true,
        unique:true
    },
    Tid : {
        type:String,
        required:true,
        unique:true
    },
    stuid : {
        type:Number,
        required:true
    }

});

// Compile model from schema
const feesModel = mongoose.model("feeModel", userSchema);
module.exports = feesModel
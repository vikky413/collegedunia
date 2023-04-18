const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
   rank : {
        type:String,
        required:true,   
    },
    cat : {
        type:String,
        required:true,   
    },
    cname : {
        type:String,
        required:true,   
    },
    link : {
        type:String,
        required:true,
    },
    fees : {
        type:Number,
        required:true
    },
    reviews : {
        type:String,
        required:true,
    },
    address : {
        type:String,
        required:true,
    },
    state : {
        type:String,
        required:true,
    },

});
// Compile model from schema
const itModel = mongoose.model("iitModel", userSchema);
module.exports = itModel

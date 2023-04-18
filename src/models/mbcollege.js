const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bSchema = new Schema({
    fname : {
        type:String,
        required:true,
    },
    lname : {
        type:String,
        required:true,
    },
    date : {
        type:Number,
        required:true,
    },
    month : {
        type:String,
        required:true,
    },
    year : {
        type:Number,
        required:true,
    },
    email : {
        type:String,
        required:true,
    },
    mnumber : {
        type:String,
        required:true,
    },
    address : {
        type:String,
        required:true
    },
    state : {
        type:String,
        required:true
    },
    city : {
        type:String,
        required:true
    },
    
    pincode : {
        type:Number,
        required:true
    },
    jeemains : {
        type:Number,
        required:true,
    },
  
    password : {
        type: String,
        required:true
    },
    college :{
        type: String,
        required:true
    },
    gender : {
        type:String,
        required:true,
    },
    stuid : {
        type:Number,
        required:true
    },
    ClassX_Board : {
        type:String,
        required:true
    },
    ClassX_Percentage : {
        type:String,
        required:true
    },
    ClassX_YrOfPassing : {
        type:String,
        required:true
    },
    ClassXII_Board : {
        type:String,
        required:true
    },
    ClassXII_Percentage : {
        type:String,
        required:true
    },
    ClassXII_YrOfPassing : {
        type:String,
        required:true
    },
    Graduation_Board : {
        type:String,
        
    },
    Graduation_Percentage : {
        type:String,
        
    },
    Graduation_YrOfPassing : {
        type:String,
        
    },
    Masters_Board : {
        type:String,
        
    },
    Masters_Percentage : {
        type:String,
        
    },
    Masters_Percentage : {
        type:String,
        
    },
});

// Compile model from schema
const btechModel = mongoose.model("BtechModel", bSchema);
module.exports = btechModel

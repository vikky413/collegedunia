const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const usersSchema = new Schema({
   
    jeemains : {
        type:Number,
        required:true,
    },
    
    che : {
        type:Number,
        required:true
    },
    phy : {
        type:Number,
        required:true
    },
    math : {
        type:Number,
        required:true
    },
    stuid : {
        type:Number,
        required:true
    }

});

// Compile model from schema
const mbbsUser = mongoose.model("mbbModel", usersSchema);
module.exports = mbbsUser

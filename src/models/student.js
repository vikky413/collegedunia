const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    
    jeemains : {
        type:Number,
        required:true,
    },
    jeeadvanced : {
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
const User = mongoose.model("userModel", userSchema);
module.exports = User

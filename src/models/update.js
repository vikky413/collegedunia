const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const updateSchema = new Schema({
    tname : {
        type:String,
        required:true,   
    },
    
    content : {
        type:String,
        required:true,   
    },
});

// Compile model from schema
const updatesModel = mongoose.model("updateModel", updateSchema);
module.exports = updatesModel

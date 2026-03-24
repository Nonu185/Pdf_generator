const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true,"please enter unique username"]
    },
    email:{
        type: String,
        unique: [true,"please enter unique email"],
        required: [true,"please enter email"]
    },
    password:{
        type: String,
        required: [true,"please enter password"]
    },
})
const Usermodel = mongoose.model("User",userSchema);

module.exports = Usermodel;

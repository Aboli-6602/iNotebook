const mongoose = require ("mongoose");
// const User = require("../models/User");

const noteSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        default: "general"
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Note", noteSchema);
// require module mongoose to deal with mongodb
const mongoose = require('mongoose');

//create schema 
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },
    age: {
        type: Number,
        min: 13
    }
})

// creaete user model in database
const User = mongoose.model('User', schema)

// export user to be used in other files
module.exports = User
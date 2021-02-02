// require module mongoose to deal with mongodb
const mongoose = require('mongoose');

// create shcema for todos
const schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 20
    },
    body: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    tags: {
        type: String,
        maxlength: 10
    },
    createdAt: {
        required: true,
        type: Date,
        default: Date.now
    },

    updatedAt: {
        required: true,
        type: Date,
        default: Date.now
    }
})

//create model todos in database
const Todo = mongoose.model('Todo', schema)

// expot Todo to be used in other files
module.exports = Todo
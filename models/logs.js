// require mongoose module
const mongoose = require('mongoose')

// create schema for logs model
const schema = new mongoose.Schema({
    urlRequested: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    currentTime: {
        type: Date,
        required: true,
        default: Date.now
    }
})

// create model for logs
const Log = mongoose.model('Log', schema);

// export log to be used in other files
module.exports = Log
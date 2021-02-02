// require module mongoose to deal with mongodb
const mongoose = require('mongoose');

// connect to server and make database called
mongoose.connect('mongodb://localhost:27017/userstodostokens', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});


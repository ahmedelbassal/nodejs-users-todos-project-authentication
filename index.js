// require express module
const express = require('express')

// for database connection
require('./db-connection')

// get logs Router
const logsRouter = require('./routers/logs')

// get todos Router
const todoRouter = require('./routers/todo')

// get user Router
const userRouter = require('./routers/user')

// extract function app from express
const app = express()

// define port
const port = 3000

// use public folder as main route '/'
app.use(express.static('public'))

// to make data streams with JSON
app.use(express.json())

// try first apu
app.get('/api', (req, res) => {
    res.send('welcome to first api')

})



// define main route for logs
app.use('/api', logsRouter)

// define main route for todos
app.use('/api/todos', todoRouter)

// define main route for todos
app.use('/api/users', userRouter)

// laungh server
app.listen(port, () => {
    console.log('server is running on localhost:' + port)
})
// require express module
const express = require('express')

// get logs mongodb model
const logModel = require('../models/logs')

//make router for logs
const logsRouter = new express.Router()

// base for routes '/api'
logsRouter.all('/*', async (req, res, next) => {

    try {

        // get url of request , request method, current time
        const urlRequested = req.originalUrl
        const method = req.method
        const currentTime = Date.now()

        // put data in database of logs
        const log = await logModel.create({ urlRequested, method, currentTime })

        res.statusCode = 200
        res.json(log)

        // next()

    } catch (err) {

        res.statusCode = 500
        res.json({ Error: "request error" })
    }

})




module.exports = logsRouter
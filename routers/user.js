// require module express
const express = require('express')

// required mongoose to find user by mongodb object id
const mongoose = require('mongoose')

// to hash password module
const bcrypt = require('bcrypt');

// module to generate token if user logged in successfully
var jwt = require('jsonwebtoken');

// require mongodb users model to deal with database
const usersModel = require('../models/users')

// create express router for user
const userRouter = new express.Router()


// to write users without duplication of writing base route

// base route: '/api/users'


// task1 register new user-----------------------------------------------
userRouter.post('/register', async (req, res) => {

    try {
        // get username and password from request body
        const { username, password, firstname, age } = req.body

        // hash password inputted 
        const hash = await bcrypt.hash(password, 7);

        // insert data into mongodb and make valudation by username when user inputted same user
        // by unique attribute in user model in schema
        const userCreated = await usersModel.create({ username, password: hash, firstname, age })

        res.statusCode = 200
        res.json({ Success: "User created successfully" })

    } catch (err) {
        res.statusCode = 500
        res.json({ Eoor: "username may exist" })
    }
})


// task2 login user -------------------------------------------
userRouter.post('/login', async (req, res) => {

    try {
        // get data from request body
        const { username, password } = req.body

        // validate if user exists
        const user = await usersModel.findOne({ username }).exec();

        if (!user) throw Error("user or password inserted wrong");// if user doesn't exist

        // if user exists .. Try to compare between hashed password in database and password inputted
        const isMatched = await bcrypt.compare(password, user.password)

        if (!isMatched) throw Error('username or password inserted wrongn'); // if password not matched

        // if matched .. generate token for that user to be used in website
        var token = await jwt.sign({ id: user._id }, 'verySecret');

        res.statusCode = 200
        res.json({ token })

    } catch (err) {

        res.statusCode = 500
        res.json({ Error: err.message })
    }

})


// task3 get user first name by toekn returned to user from login
userRouter.get('/', async (req, res) => {

    try {

        // get token from req headers in authorization value
        const { authorization } = req.headers

        // verify token by secret 'verySecret' created with token when user logged in
        var user = await jwt.verify(authorization, 'verySecret');

        if (!user) throw Error('authentication failed'); // if user not exists throw error

        // if user exists
        const userDetails = await usersModel.findOne({ _id: user.id }, { password: 0, _id: 0, __v: 0 }).exec();

        // return user first name
        res.statusCode = 200
        res.json(userDetails)

    } catch (err) {

        res.statusCode = 401
        res.json({ Eroor: err.message })
    }
})


// task 4   delete user by id from paramater only if he has same id in token in authorization
userRouter.delete('/:id', async (req, res) => {

    try {

        // get id inserted in paramater 
        const { id } = req.params

        // get id from token but first get token from authorization 
        const { authorization } = req.headers

        // get id from token signature
        var user = await jwt.verify(authorization, 'verySecret');

        // check if id in paramater is not same as id in token
        if (!(id == user.id)) throw Error("you can't delete user with that id because it isn't your id");

        // if they are same, delete user with that id
        const res = await usersModel.remove({ _id: id });


        res.statusCode = 200
        res.json({ Success: "you have deleted your user " })

    } catch (err) {

        res.statusCode = 500
        res.json({ Error: err.message })
    }
})




// task 5 edit user only if id inputted in paramater is same as that id in token in authorization
// which exists in requrest headers
userRouter.patch('/:id', async (req, res) => {

    try {

        // get id from paamater
        const { id } = req.params

        // get id from token by first take authorization from headers
        const { authorization } = req.headers

        // get data from token signature
        var user = await jwt.verify(authorization, 'verySecret');

        // check if id from token and paramaters are different
        if (!(id == user.id)) throw Error("you can't edit other user details");

        // if they are same
        // get details that this user want to modify
        const { password, firstname, age } = req.body

        // hash password inputted 
        const hash = await bcrypt.hash(password, 7);

        // modify user data
        const userModified = await usersModel.updateOne({ _id: id }, { password: hash, firstname: firstname, age: age }).exec();

        res.statusCode = 200
        res.json({ Success: "user modified successfully" })

    } catch (err) {

        res.statusCode = 500
        res.json({ Error: Eroor.message })
    }
})




// export userRouter to be used in other files
module.exports = userRouter
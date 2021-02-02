// require module express
const express = require('express')

// module to generate token if user logged in successfully
var jwt = require('jsonwebtoken');

// require mongodb users model to deal with database of user collection
// to check user id
const usersModel = require('../models/users')

// require mongodb todos model to deal with database
const todosModel = require('../models/todo')

// create express router for todos
const todoRouter = new express.Router()


// to write routes without duplication of writing base route

// base route: '/api/todos'

// task 6  post new todo by userid from token ,body,title, tags
todoRouter.post('/', async (req, res) => {

    try {

        // get values inside request body
        const { body, title, tags } = req.body

        // get token from authorization in request headers
        const { authorization } = req.headers

        //get id from token signature
        var user = await jwt.verify(authorization, 'verySecret')

        // get id of user
        const userId = user.id

        // check if user exists in database
        const checkUser = await usersModel.findOne({ _id: user.id }, { password: 0, _id: 0, __v: 0 }).exec();

        if (!checkUser) throw Error('user not exists in application so you can not input todo');

        // add new post to todos model collection
        todoCreated = await todosModel.create({ userId, body, title, tags });

        res.statusCode = 200
        res.json({ Success: "Todo created successfully" })

    } catch (err) {

        res.statusCode = 500
        res.json({ Failure: "couldn't input todo" })
    }

})






/// task 8 bonus
//Return the  todos with specified required filters (defaults are limit 10 skip 0 
todoRouter.get('/?*', async (req, res) => {

    try {

        // get query paramaters from route
        let limit = Number(req.query.limit);
        let skip = Number(req.query.skip);

        //get id of user from token signature but get authorization from request headers
        const { authorization } = req.headers

        const user = await jwt.verify(authorization, 'verySecret')

        // by id of user we can  get all todos by find todo.userid= user.id
        const todos = await todosModel.aggregate([{ $match: { userId: user.id } }]).skip(skip).limit(limit);

        res.statusCode = 200
        res.json(todos)

    } catch (err) {

        res.statusCode = 500
        res.json({ Error: "can't retreive todos" })
    }

})








// task 7 return user todos of specific user by id in token signature 
todoRouter.get('/', async (req, res) => {

    try {

        // get id from token signature but first get authorization that has token in req headers
        const { authorization } = req.headers

        var user = await jwt.verify(authorization, 'verySecret')

        // check if user exists in users database
        const checkUser = await usersModel.findOne({ _id: user.id }, { password: 0 }).exec();

        // if not exist
        if (!checkUser) throw Error('this user id not exist in application')

        const userTodos = await todosModel.find({}, { _id: 0, createdAt: 0, updatedAt: 0 }).exec()

        res.statusCode = 200
        res.json({ username: checkUser.username, todos: userTodos })

    } catch (err) {

        res.statusCode = 500
        res.json({ Error: err.message })
    }

})




// task 9 edit todo by id in paramater only if this todo belongs to this user
// validate by id in user token signature
todoRouter.patch('/:id', async (req, res) => {

    try {

        // get values from request body
        const { body, title, tags } = req.body

        // get todo id from paramaters
        const { id } = req.params

        // get id of user from token but first get it from authorization
        const { authorization } = req.headers

        // get id in signature from token
        var user = await jwt.verify(authorization, 'verySecret')

        // check if id of user is the same of owner of todo
        const checkOwner = await todosModel.findOne({ _id: id }).exec();

        // check if user id is same of userId in token
        if (!(user.id == checkOwner.userId)) throw Error("you can't edit that todo because it is not yours")

        const modifiedTodo = await todosModel.updateOne({ _id: id }, { body, title, tags, updatedAt: Date.name() }).exec();


        res.statusCode = 200
        res.json({ Success: "todo modified successfully" })

    } catch (err) {

        res.statusCode = 500
        res.json({ Failure: 'can not modify todo' })
    }

})





// task 10  delete todo by id in paramater only if this todo belongs to this user
// validate by id in user token signature
todoRouter.delete('/:id', async (req, res) => {

    try {

        // get todo id from paramaters
        const { id } = req.params

        // get id of user from token but first get it from authorization
        const { authorization } = req.headers

        // get id in signature from token
        var user = await jwt.verify(authorization, 'verySecret')

        // check if id of user is the same of owner of todo
        const checkOwner = await todosModel.findOne({ _id: id }).exec();

        // check if user id is same of userId in token
        if (!(user.id == checkOwner.userId)) throw Error("you can't delete that todo because it is not yours")

        const deletedTodo = await todosModel.remove({ _id: id }).exec();


        res.statusCode = 200
        res.json({ Success: "todo delete successfully" })

    } catch (err) {

        res.statusCode = 500
        res.json({ Failure: 'can not modify todo' })
    }

})








// export todoRouter to be used in other files
module.exports = todoRouter
const jwt = require('jsonwebtoken');
var userModel = require('../models/user-auth');
var {SECRET_KEYS, responseMessage} = require('../utilities/utility-function')

//get the db connection
const dbConnection = require('../dbConfig');

const userLogin = (req, res) => {
    userModel = req.body
    if (!userModel.username) {
        return res.json(responseMessage(response = "Username cannot be empty", isSuccess = false))
    }
    else if (!userModel.password) {
        return res.json(responseMessage(response = "Password cannot be empty", isSuccess = false))
    }
    let userExistQuery = `select * from userdetails where username ='${userModel.username}' and password=md5('${userModel.password}')`
    dbConnection.query(userExistQuery, (err, result) => {
        if (err) {
            return res.json(responseMessage(response = err.message, isSuccess = false))
        }
        if (result.length == 0) {
            return res.json(responseMessage(response = "User does not exists or password is incorrect", isSuccess = false))
        }
        const jwtToken = jwt.sign({
            "username":userModel.username
        }, SECRET_KEYS.JWT_SECRET,{expiresIn:'1d'})
        
        res.json({
            "message":"User logged in successfully",
            "token":jwtToken
        })

    })
}

const userRegister = (req, res) => {
    userModel = req.body
    if (!userModel.username) {
        return res.json(responseMessage(response = "Username cannot be empty", isSuccess = false))
    }
    else if (!userModel.password || userModel.password.length < 8 || userModel.password.length > 16) {
        if (!userModel.password) {
            return res.json(responseMessage(response = "Password cannot be empty", isSuccess = false))
        }
        return res.json(responseMessage(response = "Password should be of min 8 and max 16 characters", isSuccess = false))
    }
    else if (!userModel.confirmPassword) {
        return res.json(responseMessage(response = "Confirm password cannot be empty", isSuccess = false))

    }
    //chech whether the password and c_password is same or not
    if (userModel.password != userModel.confirmPassword) {
        return res.json(responseMessage(response = "Password and Confirm password should be the same", isSuccess = false))

    }
    let userExistQuery = `select * from userdetails where username ='${userModel.username}'`
    dbConnection.query(userExistQuery, (err, result) => {
        if (err) {
            return res.json(responseMessage(response = err.message, isSuccess = false))

        }
        if (result.length == 0) {
            let addUserQuery = `insert into userdetails(username,password) values('${userModel.username}',md5('${userModel.password}'))`
            dbConnection.query(addUserQuery, (addErr) => {
                if (addErr) {
                    return res.json(responseMessage(response = addErr.message, isSuccess = false))

                }
                res.json(responseMessage(response = "User registered successfully"))

            })

        } else {
            res.json(responseMessage(response = "User already exists", isSuccess = false))

        }

    })
}


module.exports = { userLogin, userRegister }
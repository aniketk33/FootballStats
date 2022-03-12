const express = require('express');
const routes = express.Router()
const {userLogin, userRegister} = require('../controllers/user-auth')

//user login
routes.post('/login', userLogin)

//user register
routes.post('/register', userRegister)

module.exports = routes
const express = require('express');
const app = express()
const userAuthRoutes = require('./routers/user-auth')

//get the db connection
const dbConnection = require('./dbConfig')

//middlewares
app.use(express.json())
app.use('/user',userAuthRoutes)

//database query routes
//create table
app.get('/createDb', (req, res) => {
    let createDbQuery = 'create database football_stats'
    dbConnection.query(createDbQuery, (err, result) => {
        if (err) {
            return res.json({
                error: err.message
            })
        }
        res.send(result)

    })

})

app.get('/createUserTable', (req, res) => {
    let createTableQuery = 'create table user_details (username varchar(50) not null, password varchar(32), primary key(username))'
    dbConnection.query(createTableQuery, (err, result) => {
        if (err) {
            return res.json({
                error: err.message
            })
        }
        res.send(result)

    })

})



app.all('*', (req, res) => {
    res.json({
        error: "Page not found"
    })
})

app.listen(5000, () => {
    console.log('Server is running at port 5000')
})
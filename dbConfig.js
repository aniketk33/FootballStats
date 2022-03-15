// const {SECRET_KEYS} = require('./utilities/utility-function')

const mysql = require('mysql2');
// const dbConnection = mysql.createConnection({
//     host: SECRET_KEYS.HOST,
//     user: SECRET_KEYS.USER,
//     password: SECRET_KEYS.PASSWORD,
//     database: SECRET_KEYS.DATABASE_NAME,
//     multipleStatements: true
// })

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "football_stats",
    multipleStatements: true
})

//connecting to the db server
dbConnection.connect((err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Connected to MySql')

})


module.exports = dbConnection
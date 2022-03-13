const mysql = require('mysql2');
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'football_stats',
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
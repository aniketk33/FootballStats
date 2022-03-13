const express = require('express');
const app = express()
const userAuthRoutes = require('./routers/user-auth')
const teamInfoAuthRoutes = require('./routers/teams-info')

//get the db connection
const dbConnection = require('./dbConfig')

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/user',userAuthRoutes)
app.use('/teams', teamInfoAuthRoutes)

app.get('/fixtures', (req, res) => {
    var { pageNum, date } = req.body
    if (!date) {
        return res.send({
            "error": "Please provide date"
        })
    }
    // console.log(req.body)
    if (!pageNum || pageNum < 0) {
        pageNum = 1
    }
    else {
        pageNum = (pageNum - 1) * 10
    }
    let getFixturesQuery = `select * from TeamTable; SELECT * FROM fixturetable WHERE fixture_date = '${date}' LIMIT 10 OFFSET ${pageNum};`
    // let getTeamsListQuery = 'select * from TeamTable'

    // let getFixturesQuery = `SELECT * FROM fixturetable LIMIT 10 OFFSET ${pageNum}`
    // console.log(getFixturesQuery)
    dbConnection.query(getFixturesQuery, (err, result) => {
        if (err) {
            res.send(err.message)
        }
        // console.log(result[1])
        // res.send(result)
        if (result.length > 0) {
            let teamList = result[0]
            if (teamList.length > 0) {
                var response = []
                for (let index = 0; index < result[1].length; index++) {
                    const fixtureDetails = result[1][index];
                    var fixDate = new Date(Date.parse(fixtureDetails.fixture_date))
                    // console.log(fixDate.toDateString())
                    var team1 = teamList.find(team => team.team_id == Number(fixtureDetails.teamA_id))
                    var team2 = teamList.find(team => team.team_id == Number(fixtureDetails.teamB_id))
                    response.push({
                        Team1: team1.team_name,
                        Team2: team2.team_name,
                        Score: `${fixtureDetails.teamA_score} - ${fixtureDetails.teamB_score}`,
                        Winner: fixtureDetails.winner,
                        Date: fixDate.toDateString()
                    })
                }
                if (response.length > 0) {
                    res.send(response)
                }
                else {
                    res.send({
                        "result": "No results found"
                    })
                }
            }
            else {
                res.send({
                    "error": "Something went wrong"
                })
            }

        }
        else {
            res.send({
                "error": "No data found"
            })
        }
    })
})
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
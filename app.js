const express = require('express');
const app = express()
const userAuthRoutes = require('./routers/user-auth')
const teamInfoAuthRoutes = require('./routers/team-info')
const { getTeamsList } = require('./utilities/utility-function')

const port = process.env.PORT || 5000

//get the db connection
const dbConnection = require('./dbConfig')

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//routes
app.use('/user', userAuthRoutes)
app.use('/teams', teamInfoAuthRoutes)

//home page
app.get('/', (req, res) => {
    res.send("Welcome")
})


app.get('/fixtures', (req, res) => {
    try {
        var {date ,page} = req.query
        
        if (!date) {
            return res.status(400).send({
                "error": "Please provide date"
            })
        }
        if (!page || page < 0) {
            page = 1
        }
        else {
            page = (page - 1) * 10
        }
        let getFixturesQuery = `SELECT * FROM fixturetable WHERE fixture_date >= '${date}' LIMIT 10 OFFSET ${page};`
        dbConnection.query(getFixturesQuery, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            if (!result) {
                return res.status(500).send({
                    error: "Something went wrong"
                })
            }
            if (result.length > 0) {
                let teamList = await getTeamsList()
                if (teamList.length > 0) {
                    var response = []
                    if (result.length > 0) {
                        for (let index = 0; index < result.length; index++) {
                            const fixtureDetails = result[index];
                            var fixDate = new Date(Date.parse(fixtureDetails.fixture_date))
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
                        "error": "No results found"
                    })
                }

            }
            else {
                res.send({
                    "error": "No results found"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            "error": "Something went wrong"
        })
    }
})

app.all('*', (req, res) => {
    res.status(404).json({
        error: "Page not found"
    })
})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})
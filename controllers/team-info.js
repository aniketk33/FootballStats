const dbConnection = require('../dbConfig');
let teamResults = []

const getTeamsList = (req, res) => {
    let getTeamsQuery = 'SELECT * FROM teamtable'
    dbConnection.query(getTeamsQuery, (err, result) => {

        if (err) {
            return res.json(responseMessage(response = err.message, isSuccess = false))
        }
        if (result.length > 0) {
            teamResults = result
            const response = []
            for (let index = 0; index < result.length; index++) {
                var teamDetails = result[index];
                response.push({
                    "ID": teamDetails.team_id,
                    "Name": teamDetails.team_name,
                    "Code": teamDetails.team_code,
                })

            }
            return res.send(response)
        }
        res.json(responseMessage(response = "Something went wrong", isSuccess = false))
    })
}

const getSquadInfo = (req, res) => {
    var { teamId } = req.params

    let squadQuery = `select T.team_name , S.player_name from teamtable T join squadtable S on (S.team_id = T.team_id and T.team_id = '${teamId}')`
    dbConnection.query(squadQuery, (err, result) => {
        if (err) {
            res.json(responseMessage(response = err.message, isSuccess = false))
        }
        console.log(result)
        if (result.length > 0) {
            var response = []
            for (let index = 0; index < result.length; index++) {
                var playerDetails = result[index];
                response.push({
                    "Player": playerDetails.player_name,
                    "Club": playerDetails.team_name
                })

            }
            return res.send(response)
        }
        res.send({ error: `Players not found` })
    })

}

const getTeamFixtures = (req, res) => {
    var { teamId } = req.params
    var { uptoDate, matchesCount } = req.body
    if (teamResults.length > 0) {
        var teamDetails = teamResults.find(data => data.team_id == Number(teamId))
        if (!teamDetails) {
            res.send({ error: "No results found" })
        }
        else {
            if (uptoDate || matchesCount) {
                if (!uptoDate) {
                    res.send({
                        "error": "Please provide date"
                    })
                }
                if (!matchesCount || matchesCount < 0) {
                    matchesCount = 5
                }
                var fixtureQuery = `select * from fixturetable where fixture_date <= '${uptoDate}' and (teamA_id ='${teamId}' or teamB_id ='${teamId}') order by fixture_date desc LIMIT ${matchesCount};`
            } else {


                var fixtureQuery = `SELECT * FROM FixtureTable WHERE teamA_id=${teamDetails.team_id} OR teamB_id=${teamDetails.team_id}`
            }
            dbConnection.query(fixtureQuery, (err, result) => {
                if (err) {
                    res.json(responseMessage(response = err.message, isSuccess = false))
                }
                if (result.length > 0) {
                    var response = []
                    for (let index = 0; index < result.length; index++) {
                        var fixtureDetails = result[index];
                        var fixDate = new Date(Date.parse(fixtureDetails.fixture_date))
                        if (teamDetails.team_id == fixtureDetails.teamA_id) {
                            var opponent = teamResults.find(team => team.team_id == Number(fixtureDetails.teamB_id))

                            response.push({
                                "Club": teamDetails.team_name,
                                "Opponents": opponent.team_name,
                                "Venue": "Home",
                                "Winner": fixtureDetails.winner,
                                "Score": `${fixtureDetails.teamA_score} - ${fixtureDetails.teamB_score}`,
                                Date: fixDate.toDateString()
                            })
                        }
                        else {
                            var opponent = teamResults.find(team => team.team_id == Number(fixtureDetails.teamA_id))

                            response.push({
                                "Club": teamDetails.team_name,
                                "Opponents": opponent.team_name,
                                "Venue": "Away",
                                "Winner": fixtureDetails.winner,
                                "Score": `${fixtureDetails.teamA_score} - ${fixtureDetails.teamB_score}`,
                                Date: fixDate.toDateString()
                            })
                        }

                    }
                    return res.send(response)
                }
                res.send({ error: `Players not found for ${teamId}` })
            })
        }
    }
    else {

        res.send({ error: "Something went wrong" })
    }
}


module.exports = { getTeamsList, getSquadInfo, getTeamFixtures }
const dbConnection = require('../dbConfig');
const utilityFunction = require('../utilities/utility-function')

const getTeamsList = async (req, res) => {
    try {
        var result = await utilityFunction.getTeamsList()
        const response = []
        if (result.length > 0) {
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
        res.status(500).json(utilityFunction.responseMessage(response = "Something went wrong", isSuccess = false))

    }
    catch {
        res.status(500).json(utilityFunction.responseMessage(response = "Something went wrong", isSuccess = false))
    }
}

const getSquadInfo = (req, res) => {
    var { teamId } = req.params

    let squadQuery = `select T.team_name , S.player_name from teamtable T join squadtable S on (S.team_id = T.team_id and T.team_id = '${teamId}')`
    dbConnection.query(squadQuery, (err, result) => {
        if (err) {
           return res.status(500).json(utilityFunction.responseMessage(response = err.message, isSuccess = false))
        }
        try {
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

        }
        catch {
            res.json(utilityFunction.responseMessage(response = "Something went wrong", isSuccess = false))
        }
    })

}

const getTeamFixtures = (req, res) => {
    var { teamId } = req.params
    var { uptoDate, matchesCount } = req.query

    if (uptoDate || matchesCount) {
        if (!uptoDate) {
            return res.status(400).json({
                "error": "Please provide date"
            })
        }
        if (!matchesCount || matchesCount < 0 || matchesCount > 10) {
            if (matchesCount > 10) {
                return res.status(400).json({
                    "error": "Only last 10 matches data can be obatined"
                })
            }
            matchesCount = 5
        }
        var fixtureQuery = `select * from fixturetable where fixture_date <= '${uptoDate}' and (teamA_id ='${teamId}' or teamB_id ='${teamId}') order by fixture_date desc LIMIT ${matchesCount};`
    } else {
        var fixtureQuery = `SELECT * FROM FixtureTable WHERE teamA_id=${teamId} OR teamB_id=${teamId};`
    }
    dbConnection.query(fixtureQuery, async (err, result) => {
        if (err) {
            return res.status(500).json(utilityFunction.responseMessage(response = err.message, isSuccess = false))
        }
        try {
            if (result.length > 0) {
                var teamList = await utilityFunction.getTeamsList()
                var teamDetails = teamList.find(team => team.team_id == teamId)
                var response = []
                for (let index = 0; index < result.length; index++) {
                    var fixtureDetails = result[index];
                    var fixDate = new Date(Date.parse(fixtureDetails.fixture_date))
                    if (teamDetails.team_id == fixtureDetails.teamA_id) {
                        var opponent = teamList.find(team => team.team_id == Number(fixtureDetails.teamB_id))

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
                        var opponent = teamList.find(team => team.team_id == Number(fixtureDetails.teamA_id))

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
            res.send({ error: `No matches found` })
        } catch (error) {
            return res.status(500).send({ error: "Something went wrong" })
        }

    })

}

module.exports = { getTeamsList, getSquadInfo, getTeamFixtures }
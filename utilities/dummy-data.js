const { default: fetch } = require('node-fetch');
const dbConnection = require('../dbConfig');

const fixtureModel = {
    teamA_id: undefined,
    teamB_id: undefined,
    winner: undefined,
    fixture_date: undefined,
    teamA_score: undefined,
    teamB_score: undefined,
    team1: undefined,
    team2:undefined
}

const teamsUrl = 'https://raw.githubusercontent.com/openfootball/football.json/master/2018-19/en.1.clubs.json'

const fixturesUrl = 'https://raw.githubusercontent.com/openfootball/football.json/master/2018-19/en.1.json'

const AddTeamsToDB = async () => {
    var responseString = await fetch(teamsUrl)
    var teamsJson = await responseString.json()
    var teamsList = teamsJson.clubs.sort((x, y) => {
        let a = x.name.toUpperCase(),
            b = y.name.toUpperCase();
        return a == b ? 0 : a > b ? 1 : -1;
    })

    for (let index = 0; index < teamsList.length; index++) {
        const teamDetails = teamsList[index];
        let addTeamQuery = `INSERT INTO TeamTable(team_name,team_code) VALUES('${teamDetails.name}','${teamDetails.code}')`
        dbConnection.query(addTeamQuery, (err) => {
            if (err) {
                console.log(err)
            }
        })

    }
    console.log('Successfully added teams to DB')

}

const AddFixturesToDB = async () => {
    var responseString = await fetch(fixturesUrl)
    var matchdaysJson = await responseString.json()
    const matchDayList = matchdaysJson.matches
    var fixtureData = []
    for (let index = 0; index < matchDayList.length; index++) {
        const matchDetails = matchDayList[index];
        fixtureModel.fixture_date = matchDetails.date
        fixtureModel.team1 = matchDetails.team1
        fixtureModel.team2 = matchDetails.team2
        fixtureModel.teamA_score = matchDetails.score.ft[0]
        fixtureModel.teamB_score = matchDetails.score.ft[1]
        if (fixtureModel.teamA_score > fixtureModel.teamB_score) {
            fixtureModel.winner = matchDetails.team1
        }
        else if (fixtureModel.teamA_score < fixtureModel.teamB_score) {
            fixtureModel.winner = matchDetails.team2
        }
        else {
            fixtureModel.winner = 'Draw'
        }

        let addFixtureQuery = `INSERT INTO fixturetable(fixture_date,teamA_score,teamB_score,winner,teamA_id,teamB_id) VALUES('${fixtureModel.fixture_date}','${fixtureModel.teamA_score}','${fixtureModel.teamB_score}','${fixtureModel.winner}', (SELECT team_id FROM teamtable WHERE team_name = '${fixtureModel.team1}'), (SELECT team_id FROM teamtable WHERE team_name = '${fixtureModel.team2}'))`

        dbConnection.query(addFixtureQuery,(err)=>{
            if(err){
                console.log(err)
            }
        })
    }
    console.log('Successfully added fixtures to DB')


}




// AddTeamsToDB()
// AddFixturesToDB()

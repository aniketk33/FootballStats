const { default: fetch } = require('node-fetch');
const dbConnection = require('../dbConfig');


const teamsUrl = 'https://raw.githubusercontent.com/openfootball/football.json/master/2018-19/en.1.clubs.json'

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




AddTeamsToDB()
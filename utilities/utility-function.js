const dbConnection = require('../dbConfig');

const responseMessage = (response, isSuccess = true) => {
    return (
        {
            status: isSuccess ? "success" : "error",
            response: response
        }
    )
}

// const SECRET_KEYS = {
//     HOST:"localhost",
//     USER:"root",
//     PASSWORD:"root",
//     DATABASE_NAME:"football_stats",
//     JWT_SECRET: "jwtSecret" //need to make complex later
// }

const getTeamsList = ()=>{
    return new Promise((resolve, reject) => {
        dbConnection.query('select * from teamtable',(err,res)=>{
            if(err){
              return reject(err.message)
            }
            resolve(res)
        })
    });
}


module.exports = {responseMessage, getTeamsList}
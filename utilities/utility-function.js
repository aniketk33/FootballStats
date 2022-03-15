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

const UserExists = (username)=>{
    return new Promise((resolve, reject) => {
        let userExistQuery = `select * from userdetails where username ='${username}'`
        dbConnection.query(userExistQuery, (err, result) =>{
            if(err){
                return reject(false)
            }            
            resolve(result.length > 0)
        })
    });
}


module.exports = {responseMessage, getTeamsList, UserExists}
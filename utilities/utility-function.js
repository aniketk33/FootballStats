const responseMessage = (response, isSuccess = true) => {
    return (
        {
            status: isSuccess ? "success" : "error",
            response: response
        }
    )
}
const SECRET_KEYS = {
    HOST:"localhost",
    USER:"root",
    PASSWORD:"root",
    DATABASE_NAME:"football_stats",
    JWT_SECRET:"jwtSecret" //need to make complex later
}

module.exports = {responseMessage, SECRET_KEYS}
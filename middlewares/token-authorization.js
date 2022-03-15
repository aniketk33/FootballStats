const jwt = require('jsonwebtoken');
// const {SECRET_KEYS} = require('../utilities/utility-function');

const tokenAuthorization = (req,res,next)=>{

    try {
        
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({
                "staus":"Failure",
                "message":"Please provide token"
            })
        }
        
        var token = authHeader.split(' ')[1]
        // const decodedToken = jwt.verify(token, "jwtSecret")
        jwt.verify(token, "jwtSecret")
        next()

    } catch (error) {
        return res.json({
            "error":error.message
        })
    }
}

module.exports = tokenAuthorization
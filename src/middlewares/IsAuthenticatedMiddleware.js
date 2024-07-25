const jwt = require('jsonwebtoken')
const { jwtSecret, jwtExpirationInSeconds } = require("../../config/config")

module.exports = {
    check:(req,res,next)=>{
        const authHeader = req.headers['authorization']
        if(!authHeader){
            return res.status(401).json({
                "status": 'Bad request',
                "message": 'Auth failed',
                "statusCode":"Authentication failed",
              });
        }
        
    }
}
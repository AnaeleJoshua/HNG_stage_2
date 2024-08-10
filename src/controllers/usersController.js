const userModel = require('../models/User')

module.exports = {
    getUserById : async (req,res)=>{
        const {
            params: { id }
          } = req;
    console.log(`userId: ${id}`)
        let user = await userModel.findUser({userId:id})
        if(!user){
            return res.status(401).json({
                "status":"Bad request",
                "message":"Invalid user"
            })
        }
        user = user.toJSON()
        return res.status(200).json({
            "status":"success",
            "phone":user.phone
        })
    }

}
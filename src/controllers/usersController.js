const { Sequelize } = require('sequelize');
const userModel = require('../models/User')
const {sequelize} = require("../models/index");
module.exports = {
    getUserById : async (req,res)=>{
        const {
            params: { id }
          } = req;
    console.log(`userId: ${id}`)
    const transaction = await sequelize.transaction()
        let user = await userModel.findUser({userId:id},{transaction})
        if(!user){
            await transaction.rollback()
            return res.status(401).json({
                "status":"Bad request",
                "message":"Invalid user"
            })
        }
        await transaction.commit()
        user = user.toJSON()
        return res.status(200).json({
            "status":"success",
            "phone":user.phone
        })
    },
    updateUser: async(req,res)=>{
        const {
            params: { id }
          } = req;
          const payload = req.body
          console.log(payload)
          console.log(id)
          let transaction 
          try{
             transaction = await sequelize.transaction()
          const user = await userModel.updateUser({userId:id},{payload},{transaction})
          console.log(user)
          transaction.commit()
          return res.status(200).json({
            status:"success",
            "message":"record updated"
          })
          }catch(err){
            if (transaction){
                try{
                    await transaction.rollback()
                }catch(rollbackError){
                    console.error(`transaction rollback error ${rollbackError}`)
                }
            }
            return res.status(401).json({
                "message":`record not updated`,
                "status":"bad request"
            })
          }

    }
}
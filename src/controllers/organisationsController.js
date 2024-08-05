const userModel = require('../models/User')
const {User} = require('../models/index')
const organisationModel = require('../models/Organisation')
const userOrganisationModel = require('../models/UserOrganisation')
const db_transaction = require('../models/index').db_transaction

module.exports = {
    getOrganisationById : async (req,res)=>{
        const {
            params: { id }
          } = req;
    console.log(`userId: ${id}`)
        let organisation = await organisationModel.findUser({userId:id})
        if(!organisation){
            return res.status(401).json({
                "status":"Bad request",
                "message":"Invalid user"
            })
        }
        organisation = organisation.toJSON()
        return res.status(200).json({
            "status":"success",
            "phone":user.phone
        })
    },
    getAllOrganisation : async (req,res) => {
        const userId = req.user.userId;
        // console.log(user.userId)
        const userOrganisations = await organisationModel.findAllOrganisation([{model:User,
            where:{userId}}])
        // console.log(userOrganisations)
        if (userOrganisations.length === 0){
            return res.status(200).json({
                "status": "Bad request",
                "message": 'invalid user'
            })
        }
        return res.status(200).json({
            "status":"success",
            "message": "",
            "data":{
                "organisations": userOrganisations.map((item)=>(
                    {"orgId":item.orgId,
                        "name":item.name
                    }
                ))
                
            }
        })
    },
    newOrganisation: async (req,res) => {
         const payload = req.body
         const userId = req.user.userId;
        
        console.log(userId)
        //  console.log(user)
        let transaction;
         try {
            transaction = await db_transaction()
            const user = await userModel.findUser({userId})
            console.log(user)
            const newOrg = await organisationModel.createOrganisation(Object.assign(payload,{"createdBy":`${user.firstName} ${user.lastName}`}),{transaction})
            const orgId = newOrg.orgId

            const newUserOrg = await userOrganisationModel.createUser({userId,orgId},{transaction})
           await transaction.commit()

            return res.status(201).json({
                "status":"success",
                "message":"Organisation created successfully",
                "data":{
                    "orgId": newOrg.orgId,
                    "name":newOrg.name,
                    "description":newOrg.description,
                    "createdBy":newOrg.createdBy
                }
            })

         }catch(err){
            if(transaction){
               await transaction.rollback()
            }
            return res.status(401).json({
                "status":"Bad Request",
                "message":"Client error",
                "statusCode":400,
                "err":err
            })
         }
    }
}
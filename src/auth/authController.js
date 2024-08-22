const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require('dotenv')
const {Transaction} = require('sequelize')
dotenv.config()
const UserModel = require("../models/User");
const {sequelize} = require("../models/index");

// const db_transaction = require('../models/index').db_transaction
const OrganisationModel = require("../models/Organisation");

// Generates an Access Token using username and userId for the user's authentication
const generateAccessToken = (email, userId) => {
    return jwt.sign(
      {
        userId,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION_IN_SEC,
      }
    );
  };

  // Encrypts the password using SHA256 Algorithm, for enhanced security of the password
const encryptPassword = (password) => {
    // We will hash the password using SHA256 Algorithm before storing in the DB
    // Creating SHA-256 hash object
    const hash = crypto.createHash("sha256");
    // Update the hash object with the string to be encrypted
    hash.update(password);
    // Get the encrypted value in hexadecimal format
    return hash.digest("hex");
  };

  module.exports = {

    register:async (req,res)=>{

      const payload = req.body;
      const payload_email = payload.email
      let existingUser
      //checks if email exist
     
        //db transaction
// const db_transaction = async ()=>{
//   return await sequelize.transaction()
// }


//create transaction
const transaction = await sequelize.transaction()
if(!(transaction instanceof Transaction) ){
  throw new Error('Invalid transaction object')
}
      try {
      existingUser = await UserModel.findUser({"email":payload_email},{transaction})
      if (existingUser ){
        await transaction.rollback()
        return res.status(400).json({
          "status":"Bad request",
          "message":"Email already exist",
          "statusCode":400
        })
      }
     
      let encryptedPassword = encryptPassword(payload.password)
      //create a new user with the encrypted [password]
      let user = await UserModel.createUser(Object.assign(payload,{password:encryptedPassword}))
      if (!user){
        await transaction.rollback()
        return res.status(400).json({
          "status":"Bad request",
          "message":"User not created",
          "statusCode":400
        })
      }
      //create a new organisation for every user
      // let newOrganisation = await OrganisationModel.createOrganisation({
      //     "name":`${user.firstName}'s Organisation`,
      //     "description":`${user.firstName}' organisation`,
      //     "createdBy":`${user.firstName} ${user.lastName}`
      //   })
        // if (!newOrganisation){
        //   await transaction.rollback()
        //   return res.status(400).json({
        //     "status":"Bad request",
        //     "message":"organisation not",
        //     "statusCode":400
        //   })
        // }
        //associate the user with the organisation
      //  const result =  await user.addOrganisation(newOrganisation,{transaction})
      //  if (!result && result.length < 0){
      //   throw new Error('failed to add association')
      //  }
       console.log('association added successfully')
       // commit transaaction
        await transaction.commit()
        
        const accessToken = generateAccessToken(payload.email,user.userId)
        
        console.log(`access token: ${accessToken}`)
        return res.status(200).json({
          "status":"success",
          "message":"Registration successful",
          "data":{
            "accessToken":accessToken,
            "user":{
              "userId":user.userId,
              "firstName":user.firstName,
              "lastName":user.lastName,
              "email":user.email,
              "phone":user.phone
            }
          }
        })
       }catch (error){
        if(transaction){
          try {
            await transaction.rollback(); // Ensure rollback happens in case of error
          } catch (rollbackError) {
            console.error('Transaction rollback failed:', rollbackError);
          }
        }
        return res.status(400).json({
          "status":"Bad request",
          "Message":"Registration unsuccessful",
          "statusCode":400,
          "error": error.message
        })
      }
    },
  login : async (req,res)=>{
    const {email, password} = req.body
    const user = await UserModel.findUser({ email })
  //check for user
      if (!user){
        return res.status(401).json({
          "status":false,
          "message":"user not found"
        })
      }
      
      const encryptedPassword = encryptPassword(password)
      console.log(`this is --${encryptedPassword}`)
      if (user.password !== encryptedPassword){
        return res.status(401).json({
          "status":"Bad request",
          "message":"Authentication failed",
          "statusCode": 401
        })}
        try {
        const accessToken = generateAccessToken(user.email,user.userId)
        return res.status(200).json({
          "status":"success",
          "message":"Login successful",
          "data":{
            "accessToken":accessToken,
            "user":{
              "userId":user.userId,
              "firstName":user.firstName,
              "lastName":user.lastName,
              "email":user.email,
              "phone":user.phone
            }
          }
        })
        
    }catch(err){
      res.status(500).json({
        "status":"Bad request",
        "message":"Authentication failed",
        "statusCode":401
      })
    }
    }
         }
  

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require('dotenv')
dotenv.config()
const UserModel = require("../models/User");
const db_transaction = require('../models/index').db_transaction
const OrganisationModel = require("../models/Organisation");

// const { jwtSecret, jwtExpirationInSeconds } = require("../../config/config");
// const { userInfo } = require("os");

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
      let existingUser, transaction
      //checks if email exist
     
        
      try {
         //create a transaction
      transaction = await db_transaction()
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
      let user = await UserModel.createUser(Object.assign(payload,{password:encryptedPassword}),{transaction})
      
      //create a new organisation for every user
      let newOrganisation = await OrganisationModel.createOrganisation({
          "name":`${user.firstName}'s Organisation`,
          "description":`${user.firstName}' organisation`,
          "createdBy":`${user.firstName} ${user.lastName}`
        },{transaction})
        //associate the user with the organisation
        await user.addOrganisation(newOrganisation,{transaction})
        //commit transaaction
        await transaction.commit()
       
        const accessToken = generateAccessToken(payload.email,user.userId)
        user = user.toJSON()
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
          "error": error
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
  

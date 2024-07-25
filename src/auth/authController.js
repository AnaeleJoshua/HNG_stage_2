const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserModel = require("../models/User");

const { jwtSecret, jwtExpirationInSeconds } = require("../../config/config");
// const { userInfo } = require("os");

// Generates an Access Token using username and userId for the user's authentication
const generateAccessToken = (email, userId) => {
    return jwt.sign(
      {
        userId,
        email,
      },
      jwtSecret,
      {
        expiresIn: jwtExpirationInSeconds,
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
      //checks if email exist
      const existingUser = await UserModel.findUser({"email":payload_email})
      if (existingUser){
        return res.status(400).json({
          "status":"Bad request",
          "message":"Email already exist",
          "statusCode":400
        })
      }

      let encryptedPassword = encryptPassword(payload.password)
      let user = await UserModel.createUser(Object.assign(payload,{password:encryptedPassword}))
      user = user.toJSON()
      const accessToken = generateAccessToken(payload.email,user.userId)
     try {
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
      return res.status(400).json({
        "status":"Bad request",
        "Message":"Registration unsuccessful",
        "statusCode":400
      })
    }
  },
  login : async (req,res)=>{
    const {email, password} = req.body
    const user = await UserModel.findUser({ email })
    console.log(`this is --${user.phone}`)
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
        console.log(`this is access --${accessToken}`)
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
  

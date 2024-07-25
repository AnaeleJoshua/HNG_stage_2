const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT || 3000
const Express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { Sequelize } = require("sequelize");


// Express Routes Import
const AuthorizationRoutes = require("./src/auth/authRoutes");
const UserRoutes = require("./src/routes/userRoutes");
const OrganizationRoutes = require("./src/routes/organisationsRoutes");

// Sequelize model imports
const UserModel = require("./src/models/User");
const OrganisationModel = require("./src/models/Organisation");
const UserOrganisationModel = require("./src/models/UserOrganisation");

app.use(morgan("tiny"));
app.use(cors());

// Middleware that parses the body payloads as JSON to be consumed next set
// of middlewares and controllers.
app.use(Express.json());
let sequelize
try{
  //  sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
  //   host:"localhost",
  //   dialect: "postgres",
  //   // storage: "./storage/data.db", // Path to the file that will store the SQLite DB.
  // });

   sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
});
// console.log(sequelize)


}catch(err){
  console.log(`sequelize connection not created: ${err}`)
}

// initializing the model on sequelize
const User = UserModel.initialize(sequelize)
const Organisation = OrganisationModel.initialize(sequelize)
const UserOrganisation = UserOrganisationModel.initialize(sequelize)
// console.log(`this is ...... ${User}`)
console.log(`this is ...... ${Organisation}`)

// Define relationship between models
User.belongsToMany(Organisation,{through:UserOrganisation})
Organisation.belongsToMany(User,{through:UserOrganisation})

// Syncing the models that are defined on sequelize with the tables that alredy exists
// in the database. It creates models as tables that do not exist in the DB.
sequelize
  .sync()
  .then(() => {
app.get("/",(req,res)=>res.send('Express on vercel'))
// Attaching the Authentication and User Routes to the app.
app.use("/auth", AuthorizationRoutes);
// app.use("/api/users", UserRoutes);
// app.use("/organisations", OrganizationRoutes);
app.listen(port,()=>console.log(`server ready on port:${port}`))
}).catch((err) => {
  console.error('error ', err)
})
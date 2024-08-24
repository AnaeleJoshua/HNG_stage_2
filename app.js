const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT || 3000
const Express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const {sequelize} = require('./src/models/index')

//create swaggerDocs file
const swaggerJsDocs = YAML.load('./api.yaml')

// Express Routes Import
const AuthorizationRoutes = require("./src/auth/authRoutes");
const UserRoutes = require("./src/routes/userRoutes");
const OrganizationRoutes = require("./src/routes/organisationsRoutes");

//middleware import
const errorHandler = require('./src/middlewares/errorHandling')

app.use(morgan("tiny"));
app.use(cors());

// Middleware that parses the body payloads as JSON to be consumed next set
// of middlewares and controllers.
app.use(Express.json());

app.use(errorHandler)

// Syncing the models that are defined on sequelize with the tables that alredy exists
// in the database. It creates models as tables that do not exist in the DB.
sequelize
  .sync()
  .then(() => {
app.get("/",(req,res)=>res.send('Express on vercel'))
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerJsDocs))
// Attaching the Authentication and User Routes to the app.
app.use("/auth", AuthorizationRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/organisations", OrganizationRoutes);
app.listen(port,()=>console.log(`server ready on port:${port}`))
}).catch((err) => {
  console.error('error ', err)
})
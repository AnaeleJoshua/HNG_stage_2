const { Sequelize,DataTypes } = require("sequelize");

// Sequelize model imports
const UserModel = require("./User");
const OrganisationModel = require("./Organisation");
const UserOrganisationModel = require("./UserOrganisation");

let sequelize
try{
   sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
    host:"localhost",
    dialect: "postgres",
    // storage: "./storage/data.db", // Path to the file that will store the SQLite DB.
  });

  //  sequelize = new Sequelize(process.env.POSTGRES_URL, {
  //   dialect: 'postgres',
  //   dialectModule:require('pg'),
  //   protocol: 'postgres',
  //   logging: false,
// });
// console.log(sequelize)


}catch(err){
  if (err instanceof Sequelize.ConnectionError){
    console.error('Connection error:', err.original)
    console.log(`sequelize connection not created: ${err}`)
  }
  else if (err instanceof Sequelize.TimeoutError) {
    console.error('Timeout error:', err.original);
  } 
}

//db transaction
const db_transaction = async ()=>{
  return await sequelize.transaction()
}

// console.log(`this is db_transaction: ${db_transaction}`)
// initializing the model on sequelize
const User = UserModel.initialize(sequelize)
const Organisation = OrganisationModel.initialize(sequelize)
const UserOrganisation = UserOrganisationModel.initialize(sequelize)
// console.log(`this is ...... ${User}`)
console.log(`this is ...... ${Organisation}`)

// Define relationship between models
User.belongsToMany(Organisation,
  {through:UserOrganisation,
  foreignKey:'userId',onDelete:'CASCADE'})
Organisation.belongsToMany(User,
  {through:UserOrganisation,
  foreignKey:'orgId',onDelete:'CASCADE'
  })

module.exports = {
    sequelize,
    User,
    Organisation,
    UserOrganisation,
    db_transaction
}
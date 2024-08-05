const { DataTypes } = require("sequelize");
const { User, Organisation } = require("./index");
const UserOrganisationModel = {
    userId: {
        type: DataTypes.INTEGER,
        // autoIncrement: true,
        // references:{
        //   model:User,
        //   key:'userId'
        // }
      },
      orgId: {
        type: DataTypes.INTEGER,
        // autoIncrement: true,
        // references:{
        //   model:Organisation,
        //   key:'orgId'
        // }
      },
}

module.exports = {
    initialize: (sequelize) => {
      this.model = sequelize.define("userOrganisation", UserOrganisationModel);
      return this.model
    },
  
    createUser: (user) => {
      return this.model.create(user);
    },
  
  };
  
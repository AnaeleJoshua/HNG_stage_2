const { DataTypes } = require("sequelize");
const UserOrganisationModel = {
    userId: {
        type: DataTypes.INTEGER,
        // autoIncrement: true,
      },
      orgId: {
        type: DataTypes.INTEGER,
        // autoIncrement: true,
      },
}

module.exports = {
    initialize: (sequelize) => {
      this.model = sequelize.define("userOrganisation", UserOrganisationModel);
      return this.model
    },
  
    // createUser: (user) => {
    //   return this.model.create(user);
    // },
  
  };
  
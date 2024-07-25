const { DataTypes } = require("sequelize");

const OrganisationModel = {
  orgId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
  }
};

module.exports = {
    initialize: (sequelize) => {
      this.model = sequelize.define("organisation", OrganisationModel)
      return this.model
    },
  
    createOrganisation: (organisation) => {
      return this.model.create(organisation);
    },
  
    findOrganisation: (query) => {
      return this.model.findOne({
        where: query,
      });
    },
  
    deleteOrganisation: (query) => {
      return this.model.destroy({
        where: query
      });
    }
  };
  
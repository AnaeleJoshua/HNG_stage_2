const { DataTypes } = require("sequelize");

const UserModel = {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull:true
  }
};

module.exports = {
    initialize: (sequelize) => {
      this.model = sequelize.define("user", UserModel);
      return this.model
    },
  
    createUser: (user) => {
      return this.model.create(user);
    },
  
    findUser: (query) => {
      return this.model.findOne({
        where: query,
      });
    },
  
    updateUser: (query, updatedValue) => {
      return this.model.update(updatedValue, {
        where: query,
      });
    },
  
    findAllUsers: (query) => {
      return this.model.findAll({
        where: query
      });
    },
  
    deleteUser: (query) => {
      return this.model.destroy({
        where: query
      });
    }
  };
  
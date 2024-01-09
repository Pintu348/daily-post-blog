const { Sequelize, DataTypes } = require('sequelize');

const sequelize=require("../util/database");

const User = sequelize.define('User', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey : true,
    allowNull: false
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique : true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
    // allowNull defaults to true
  }
}
// , {
//   // Other model options go here
//   timestamps: true
// }
);

module.exports = User;
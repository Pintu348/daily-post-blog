const { Sequelize, DataTypes } = require('sequelize');

const sequelize=require("../util/database");

const Post = sequelize.define('Post', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey : true,
    allowNull: false
  },
  Title:{
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
    // allowNull defaults to true
  }
}
// , {
//   // Other model options go here
//   timestamps: true
// }
);

module.exports = Post;
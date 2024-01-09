const { Sequelize, DataTypes } = require('sequelize');
const sequelize=require("../util/database");
const favoritePost = sequelize.define("favoritePost",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    }
},{timestamps:false});
module.exports = favoritePost;
const { Sequelize, DataTypes } = require('sequelize');

const sequelize=require("../util/database");


const LikedPost = sequelize.define("LikedPost",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    }
},{timestamps:false});


module.exports = LikedPost;
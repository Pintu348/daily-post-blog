const { Sequelize, DataTypes } = require('sequelize');

const sequelize=require("../util/database");


const Likes = sequelize.define("Likes",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    count:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    }
},{timestamps:false});


module.exports = Likes;
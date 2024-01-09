
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE,process.env.USER, process.env.PASSWORD, {
    host : 'localhost',
    dialect : 'mysql'
  });

module.exports = sequelize;
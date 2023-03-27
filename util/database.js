const Sequelize = require('sequelize');
const sequelize = new Sequelize("quiz", "root", "", {
    host: "localhost",
    dialect: "mysql"
  });

module.exports= sequelize;
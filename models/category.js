const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Category = sequelize.define('category', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Category;
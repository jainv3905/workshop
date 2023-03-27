const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Question = sequelize.define('question', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  first_option:{
    type: Sequelize.STRING,
    allowNull: false
  },
  second_option:{
    type: Sequelize.STRING,
    allowNull: false
  },
  third_option:{
    type: Sequelize.STRING,
    allowNull: false
  },
  fourth_option:{
    type: Sequelize.STRING,
    allowNull: false
  },
  correct:{
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Question;
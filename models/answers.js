const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Answer = sequelize.define('answer', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  // quizId: {
  //   type: Sequelize.STRING,
  //   allowNull: false
  // },
  answer: {
    type: Sequelize.STRING,
    allowNull: false
  },
  test: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  skip:{
    type: Sequelize.INTEGER
  }
});

module.exports = Answer;
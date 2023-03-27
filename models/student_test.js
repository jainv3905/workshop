const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Student_test = sequelize.define('student-test', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  test_no: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  correct: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  incorrect: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  skip: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  percentage: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  qualified: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = Student_test;
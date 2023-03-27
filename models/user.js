const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type:{
    type: Sequelize.STRING,
    allowNull: false
  },
  stream:{
    type: Sequelize.STRING,
  },
  token:{
    type: Sequelize.STRING
  }
});

module.exports = User;
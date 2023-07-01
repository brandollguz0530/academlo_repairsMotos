const { Sequelize } = require('sequelize');

const db = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'repairsmotosacademlo',
  port: 3306,
  logging: false,
});

module.exports = { db };

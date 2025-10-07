const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST || 'localhost',
  port: DB_PORT ? parseInt(DB_PORT) : 3306,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
});

module.exports = sequelize;

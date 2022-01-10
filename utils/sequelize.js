const config = require('../utils/config')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASS, {
    host: config.DB_HOST,
    dialect: "mysql"
})

module.exports = sequelize

const Sequelize = require('sequelize')
const sequelize = require('../utils/sequelize')

const Transaction = sequelize.define('transaction', {
	transaction_uuid: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true
    },
	transaction_status_code: {
        type: Sequelize.STRING(255),
        allowNull:false
    },
    transaction_value: {
        type: Sequelize.FLOAT,
        allowNull:false
    },
    transaction_datetime: {
        type: Sequelize.DATE,
        allowNull:false
    },
    transaction_payment_note_uuid: {
        type: Sequelize.STRING(255),
        allowNull:false
    }
}, {
    tableName: 'transaction',
    timestamps: false
})

module.exports = Transaction

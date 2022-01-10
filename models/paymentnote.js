const Sequelize = require('sequelize')
const sequelize = require('../utils/sequelize')

const Paymentnote = sequelize.define('payment_note', {
	payment_note_uuid: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true
    },
	payment_note_period_from_datetime	: {
        type: Sequelize.DATE,
        allowNull:false
    },
	payment_note_period_to_datetime	: {
        type: Sequelize.DATE,
        allowNull:false
    },
	payment_note_created_datetime	: {
        type: Sequelize.DATE,
        allowNull:false
    },
    payment_note_transactions_count: {
        type: Sequelize.INTEGER(11),
        allowNull:false
    },
    payment_note_value: {
        type: Sequelize.FLOAT,
        allowNull:false
    },
    payment_note_status_code: {
        type: Sequelize.STRING(255),
        allowNull:false
    }
}, {
    tableName: 'payment_note',
    timestamps: false
})

module.exports = Paymentnote

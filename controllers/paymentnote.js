const router = require('express').Router()
const Paymentnote = require('../models/paymentnote')
const Transaction = require('../models/transaction')
const { Op, QueryTypes } = require('sequelize')
const sequelize = require('../utils/sequelize')
const uuid4 = require("uuid4")

router.get('/', async (request, response) => {
    const limit = request.query.limit ? parseInt(request.query.limit) : 10
    const offset = request.query.offset ? parseInt(request.query.offset) : 0

    const paymentnotes = await Paymentnote.findAndCountAll({ limit, offset })

    response.json(paymentnotes)
})

router.get('/:uuid', async (request, response) => {
    const paymentnote = await Paymentnote.findByPk(request.params.uuid)

    if (!paymentnote) {
        response.status(404)
    }

    const data = await Transaction.findAll({
        where: { transaction_payment_note_uuid: request.params.uuid }
    })

    // Build the response
    result = {
        "payment_note_period_from_datetime": paymentnote.payment_note_period_from_datetime,
        "payment_note_period_to_datetime": paymentnote.payment_note_period_to_datetime,
        "payment_note_created_datetime": paymentnote.payment_note_created_datetime,
        "payment_note_transactions_count": paymentnote.payment_note_transactions_count,
        "payment_note_value": paymentnote.payment_note_value,
        "payment_note_status_code": paymentnote.payment_note_status_code,
        "transactions": data || []
    }

    response.json(result)
})

router.post('/', async (request, response) => {
    const body = request.body

    if (!body.period_from || !body.period_to) {
        response.status(404).send({ error: 'Must provide period_from and preiod_to' })
    }

    // User values
    const payment_note_period_from_datetime = body.period_from
    const payment_note_period_to_datetime = body.period_to

    // Default values
    const payment_note_uuid = uuid4()

    const now = new Date()
    const payment_note_created_datetime = now.toISOString()

    const payment_note_transactions_count = 0
    const payment_note_value = 0
    const payment_note_status_code = "CREATING"

    const note = {
        payment_note_uuid,
        payment_note_created_datetime,
        payment_note_period_from_datetime,
        payment_note_period_to_datetime, 
        payment_note_transactions_count,
        payment_note_value,
        payment_note_status_code
    }

    const paymentnote = await Paymentnote.create(note)

    // response.json(paymentnote)

    const transactions = await Transaction.findAndCountAll({
        where: {
            transaction_status_code: "PENDING",
            transaction_datetime: {
                [Op.gte]: paymentnote.payment_note_period_from_datetime,
                [Op.lt]: paymentnote.payment_note_period_to_datetime
            }
        }
    })

    console.log(transactions.count)

    let total = 0
    const uuids = []

    if (transactions.count > 0) {
        transactions.rows.forEach((transaction) => {
            total = total + parseFloat(transaction.transaction_value)
            uuids.push(transaction.transaction_uuid)
        })

        const sUuids = "'" + uuids.join("','") + "'"

        // Massive update
        const sql = `
              UPDATE transaction
              SET 
                transaction_status_code = 'PAID',
                transaction_payment_note_uuid = '${paymentnote.payment_note_uuid}'
              WHERE transaction_uuid IN(${sUuids});
        `

        await sequelize.query(sql, { type: QueryTypes.UPDATE })

        Paymentnote.update(
            // attributes
            {
                payment_note_status_code: "COMPLETED",
                payment_note_value: total,
                payment_note_transactions_count: transactions.count
            },
            // where
            {
                where: { payment_note_uuid: paymentnote.payment_note_uuid }
            }
        )
    }

    response.json({
        payment_note_uuid: paymentnote.payment_note_uuid
    })
})

module.exports = router

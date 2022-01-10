const router = require('express').Router()
const Transaction = require('../models/transaction')

router.get('/', async (request, response) => {
    const limit = request.query.limit ? parseInt(request.query.limit) : 10
    const offset = request.query.offset ? parseInt(request.query.offset) : 0

    const transactions = await Transaction.findAndCountAll({ limit, offset })

    response.json(transactions)
})

router.get('/:uuid', async (request, response) => {
    const transaction = await Transaction.findByPk(request.params.uuid)

    if (!transaction) {
        response.status(404)
    }

    response.json(transaction)
})

module.exports = router

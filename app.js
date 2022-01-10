const config = require('./utils/config')
const logger = require('./utils/logger')

const express = require('express')
const app = express()
const cors = require('cors')

const sequelize = require('./utils/sequelize')

app.use(cors())

// Parse JSON bodies (as sent by API clients)
app.use(express.json())

// Routes
const transactionRouter = require('./controllers/transaction')
const paymentNoteRouter = require('./controllers/paymentnote')

app.use('/api/transaction', transactionRouter)
app.use('/api/paymentnote', paymentNoteRouter)

/*
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
*/

module.exports = app

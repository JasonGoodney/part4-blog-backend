const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

console.log('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Database')
  })
  .catch(err => {
    console.log('Not Connected to Database ERROR! ', err)
  })

app.use(cors())
app.use(bodyParser.json())

module.exports = app

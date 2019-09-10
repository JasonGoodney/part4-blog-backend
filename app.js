const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

// mjeCxC4j80jlRXb3
// mongodb+srv://fullstack:<password>@cluster0-2hfnn.mongodb.net/test?retryWrites=true&w=majority
// mongodb+srv://fullstack:mjeCxC4j80jlRXb3@cluster0-2hfnn.mongodb.net/blog-list-app?retryWrites=true&w=majority
const mongoUrl = 'mongodb://localhost:27017/bloglist'
mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Database')
  })
  .catch(err => {
    console.log('Not Connected to Database ERROR! ', err)
  })

app.use(cors())
app.use(bodyParser.json())

module.exports = app

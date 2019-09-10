const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)
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

var db = mongoose.connection

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(cors())
app.use(bodyParser.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

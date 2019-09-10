require('dotenv').config()

let PORT = process.env.PORT || 3003
let MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/bloglist'

module.exports = {
  MONGODB_URI,
  PORT
}

// mjeCxC4j80jlRXb3
// mongodb+srv://fullstack:<password>@cluster0-2hfnn.mongodb.net/test?retryWrites=true&w=majority
// mongodb+srv://fullstack:mjeCxC4j80jlRXb3@cluster0-2hfnn.mongodb.net/blog-list-app?retryWrites=true&w=majority

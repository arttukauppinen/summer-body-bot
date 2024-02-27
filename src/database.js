const mongoose = require('mongoose')
const { mongodbUri } = require('./config')

const connectDatabase = async () => {
  try {
    await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('Connected to database successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

// Example schema and model
const userSchema = new mongoose.Schema({
  username: String,
  chatId: Number
})

const User = mongoose.model('User', userSchema)

module.exports = { connectDatabase, User }
const mongoose = require('mongoose')
const { mongodbUri } = require('./config/botConfig')

const connectDatabase = async () => {
  try {
    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

connectDatabase()

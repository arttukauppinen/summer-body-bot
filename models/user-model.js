const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  studyGroup: { 
    type: String, 
    enum: ['TiK', 'PT'], 
    required: true 
  },
  points: [{
    week: Number,
    sport: Number,
    sleep: Number,
    meditation: Number,
    other: Number,
  }],
})

module.exports = mongoose.model('User', userSchema)

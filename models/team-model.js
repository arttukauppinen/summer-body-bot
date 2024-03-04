const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalPoints: [{
    type: Number,
    required: true,
    default: 0
  }]
})

module.exports = mongoose.model('Team', teamSchema)

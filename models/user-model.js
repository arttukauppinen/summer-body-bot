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
  name: {
    type: String,
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  guild: {
    type: String, 
    enum: ['TIK', 'PT'], 
    required: true 
  },
  points: {
    exercise: { type: Number, default: 0 },
    trySport: { type: Number, default: 0 },
    sportsTurn: { type: Number, default: 0 },
    tryRecipe: { type: Number, default: 0 },
    goodSleep: { type: Number, default: 0 },
    meditate: { type: Number, default: 0 },
    lessAlc: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  }
}, { timestamps: true })

userSchema.index({ team: 1 })

module.exports = mongoose.model('User', userSchema)

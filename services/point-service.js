const User = require('../models/user-model')

//TODO error handling here and in controllers

const addPoints = async (userId, pointsData) => {
  try {
    const user = await User.findById(userId)
    // pointsData is an object like { week: 1, sport: 5, ... }
    user.points.push(pointsData)
    await user.save()
    return user
  } catch (error) {
    throw error
  }
}

module.exports = {
  addPoints,
}

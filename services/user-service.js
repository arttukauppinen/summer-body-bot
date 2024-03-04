const User = require('../models/user-model')

//TODO error handling here and in controllers

const createUser = async (userData) => {
  try {
    const user = new User(userData)
    await user.save()
    return user
  } catch (error) {
    throw error
  }
}

module.exports = {
  createUser,
}

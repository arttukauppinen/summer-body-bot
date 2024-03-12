const User = require('../models/user-model')

const createUser = async (userData) => {
  try {
    const user = new User(userData)
    await user.save()
    return user
  } catch (error) {
    console.error('Error occurred in createUser:', error)
    throw new Error('Error creating user')
  }
}

const getAllUsers = async () => {
  try {
    const users = await User.find({})
    return users
  } catch (error) {
    console.error('Error occurred in getAllUsers:', error)
    return []
  }
}

const deleteUser = async (userId) => {
  try {
    const result = await User.deleteOne({ userId: userId })
    return result
  } catch (error) {
    console.error('Error occurred in deleteUser:', error)
    throw new Error('Error deleting user')
  }
}

const findUser = async (userId) => {
  try {
    const user = await User.findOne({ userId: userId })
    return user
  } catch (error) {
    console.error('Error occurred in findUser:', error)
    throw new Error('Error finding user')
  }
}

const addUserToTeam = async (userId, teamId) => {
  try {
    const user = await User.findById(userId)

    user.team = teamId
    await user.save()
    return user
  } catch (error) {
    console.error('Error occurred in addUserToTeam:', error)
    throw new Error('Error adding user to team')
  }
}

const sendReminder = async (bot) => {
  const users = await getAllUsers()
  const today = new Date().toISOString().split('T')[0]

  users.forEach((user) => {
    //if (!user.lastSubmission || user.lastSubmission.toISOString().split('T')[0] !== today) {
      bot.telegram.sendMessage(user.userId, "i am the mikk dogg")
    //}
  })
}

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  findUser,
  addUserToTeam,
  sendReminder
}

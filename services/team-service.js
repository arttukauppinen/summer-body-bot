const Team = require('../models/team-model')

//TODO error handling here and in controllers

const createTeam = async (teamName) => {
  try {
    const team = new Team({ name: teamName })
    await team.save()
    return team
  } catch (error) {
    throw error
  }
}

const addMemberToTeam = async (teamId, userId) => {
  try {
    const team = await Team.findById(teamId)
    team.members.push(userId)
    await team.save()
    return team
  } catch (error) {
    throw error
  }
}


module.exports = {
  createTeam,
  addMemberToTeam,
}

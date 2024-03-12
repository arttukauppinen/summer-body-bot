const Team = require('../models/team-model')
const User = require('../models/user-model')
const userService = require('./user-service')

const addPoints = async (userId, pointsData) => {
  try {
    const user = await userService.findUser(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const team = await Team.findById(user.team)
    if (!team) {
      throw new Error('Team not found')
    }

    Object.keys(pointsData).forEach((key) => {
      user.points[key] += pointsData[key]
    })
    await user.save()
    
    Object.keys(pointsData).forEach((key) => {
      team.points[key] += pointsData[key]
    })
    await team.save()

    return user
  } catch (error) {
    console.error('Error occurred in addPoints:', error)
    throw new Error('Error adding points')
  }
}

const getTeamRankings = async () => {
  try {
    const teams = await Team.find().sort({ 'points.total': -1 }).limit(10)
    return teams.map(team => ({
      name: team.name,
      totalPoints: team.points.total
    }))
  } catch (error) {
    console.error('Error occurred in getTeamRankings:', error)
    throw new Error('Error fetching team rankings')
  }
}

const getTeamMemberRankings = async (userId) => {
  try {
    const user = await userService.findUser(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const teamMembers = await User.find({ team: user.team }).sort({ 'points.total': -1 })
    return teamMembers.map(member => ({
      username: member.username,
      totalPoints: member.points.total
    }))
  } catch (error) {
    console.error('Error occurred in getTeamMemberRankings:', error)
    throw new Error('Error fetching team member rankings')
  }
}

const getUserSummary = async (userId) => {
  try {
    const user = await userService.findUser(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return user.points
  } catch (error) {
    console.error('Error occurred in getUserSummary:', error)
    throw new Error('Error fetching user summary')
  }
}

const getUserRanking = async (userId) => {
  try {
    const users = await User.find().sort({ 'points.total': -1 }).lean()
    const user = userService.findUser(userId)
    if (!user) {
      throw new Error('User not found')
    }
    const ranking = users.indexOf(user) + 2
    return ranking
  } catch (error) {
    console.error('Error occurred in getUserRanking:', error)
    throw new Error('Error fetching user ranking')
  }
}


const getGuildsTotals = async () => {
  try {
    const categories = ['exercise', 'trySport', 'sportsTurn', 'tryRecipe', 'goodSleep', 'meditate', 'lessAlc', 'total']
    const guildAggregations = await Promise.all(categories.map(category => 
      Team.aggregate([
        {
          $group: {
            _id: "$guild",
            categoryPoints: { $sum: `$points.${category}` },
          }
        },
        {
          $project: {
            guild: "$_id",
            _id: 0,
            category,
            points: "$categoryPoints",
          }
        }
      ])
    ))

    const flattenedAggregations = guildAggregations.flat()
    const guilds = {}

    flattenedAggregations.forEach(item => {
      if (!guilds[item.guild]) {
        guilds[item.guild] = { guild: item.guild }
      }
      guilds[item.guild][item.category] = item.points
    })

    return Object.values(guilds)
  } catch (error) {
    console.error('Error occurred in getGuildsStandings:', error)
    throw new Error('Error fetching guild standings')
  }
}

const getGuildsTotalPoints = async () => {
  try {
    const totalPointsAggregation = await Team.aggregate([
      {
        $group: {
          _id: "$guild",
          totalPoints: { $sum: "$points.total" },
        }
      },
      {
        $project: {
          guild: "$_id",
          _id: 0,
          total: "$totalPoints",
        }
      }
    ])

    return totalPointsAggregation.map(item => ({
      guild: item.guild,
      total: item.total
    }))
  } catch (error) {
    console.error('Error occurred in getGuildsTotalPoints:', error)
    throw new Error('Error fetching guild total points')
  }
}


module.exports = {
  addPoints,
  getTeamRankings,
  getTeamMemberRankings,
  getUserSummary,
  getUserRanking,
  getGuildsTotals,
  getGuildsTotalPoints
}

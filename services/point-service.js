const Team = require('../models/team-model')
const User = require('../models/user-model')

const addPoints = async (userId, pointsData) => {
  try {
    const user = await User.findOne({ userId: userId })
    if (!user) {
      throw new Error('User not found')
    }

    const team = await Team.findById(user.team)
    if (!team) {
      throw new Error('Team not found')
    }

    Object.keys(pointsData).forEach((key) => {
      user.points[key] += pointsData[key]
      user.lastSubmission = new Date()
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
    const teams = await Team.find()

    const teamsWithAverages = await Promise.all(teams.map(async (team) => {
      const teamMembersCount = await User.countDocuments({ team: team._id })
      const averagePointsPerMember = teamMembersCount > 0 ? team.points.total / teamMembersCount : 0

      return {
        _id: team._id,
        name: team.name,
        totalPoints: team.points.total,
        averagePointsPerMember,
      }
    }))

    const sortedTeams = teamsWithAverages.sort((a, b) => b.averagePointsPerMember - a.averagePointsPerMember).slice(0, 30)

    return sortedTeams.map(team => ({
      name: team.name,
      totalPoints: team.totalPoints,
      averagePointsPerMember: team.averagePointsPerMember.toFixed(1)
    }))
  } catch (error) {
    console.error('Error occurred in getTeamRankings:', error)
    throw new Error('Error fetching team rankings')
  }
}

const getTeamMemberRankings = async (userId) => {
  try {
    const user = await User.findOne({ userId: userId })
    if (!user) {
      throw new Error('User not found')
    }

    const team = await Team.find({ _id: user.team })
    if (!team) {
      throw new Error('Team not found')
    }
    const teamName = team[0].name
    
    const teamMembers = await User.find({ team: user.team }).sort({ 'points.total': -1 })
    return teamMembers.map(member => ({
      name: member.name,
      totalPoints: member.points.total,
      teamName: teamName
    }))
  } catch (error) {
    console.error('Error occurred in getTeamMemberRankings:', error)
    throw new Error('Error fetching team member rankings')
  }
}

const getUserSummary = async (userId) => {
  try {
    const user = await User.findOne({ userId: userId })
    if (!user) {
      throw new Error('User not found')
    }

    return user.points
  } catch (error) {
    console.error('Error occurred in getUserSummary:', error)
    throw new Error('Error fetching user summary')
  }
}

const getGuildsLeaderboards = async () => {
  try {
    const teams = await Team.find()
    
    const guildMembersCount = await Promise.all(teams.map(async (team) => {
      const teamMembersCount = await User.countDocuments({ team: team._id })
      return {
        guild: team.guild,
        teamMembersCount
      }
    }))
    .then(results => results.reduce((acc, curr) => {
      acc[curr.guild] = (acc[curr.guild] || 0) + curr.teamMembersCount
      return acc
    }, {}))

    const totalPointsAggregation = await Team.aggregate([
      {
        $group: {
          _id: "$guild",
          totalPoints: { $sum: "$points.total" },
        }
      },
    ])

    const resultsWithAverage = totalPointsAggregation.map(item => {
      const guildMembers = guildMembersCount[item._id] || 0
      const averagePoints = guildMembers > 0 ? (item.totalPoints / guildMembers).toFixed(1) : 0
      return {
        guild: item._id,
        average: averagePoints
      }
    })

    return resultsWithAverage
  } catch (error) {
    console.error('Error occurred in getGuildsLeaderboards:', error)
    throw new Error('Error fetching guild average points')
  }
}

const getGuildsTotals = async () => {
  try {
    const categories = ['exercise', 'trySport', 'sportsTurn', 'tryRecipe', 'goodSleep', 'meditate', 'lessAlc', 'total']
    const guilds = { 'TIK': { guild: 'TIK', participants: 0 }, 'PT': { guild: 'PT', participants: 0 } }

    // Initialize each guild with default values for each category
    Object.keys(guilds).forEach(guildName => {
      categories.forEach(category => {
        guilds[guildName][category] = { total: 0, average: 0 }
      })
    })

    // First, get count of members per guild
    const teams = await Team.find()
    const guildMembersCount = await Promise.all(teams.map(async (team) => {
      const teamMembersCount = await User.countDocuments({ team: team._id })
      return {
        guild: team.guild,
        teamMembersCount
      }
    }))
    .then(results => results.reduce((acc, curr) => {
      acc[curr.guild] = (acc[curr.guild] || 0) + curr.teamMembersCount
      return acc
    }, {}))

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

    // Update guild data with actual values
    flattenedAggregations.forEach(item => {
      if (guilds[item.guild]) {
        const guildMembers = guildMembersCount[item.guild] || 1  // Default to 1 to avoid division by zero
        guilds[item.guild].participants = guildMembers  // Set participants count to actual number of members
        guilds[item.guild][item.category] = {
          total: item.points,
          average: (item.points / guildMembers).toFixed(1)  // Correct average calculation
        }
      }
    })

    return Object.values(guilds)
  } catch (error) {
    console.error('Error occurred in getGuildsTotals:', error)
    throw new Error('Error fetching guild totals with averages and participant counts')
  }
}


module.exports = {
  addPoints,
  getTeamRankings,
  getTeamMemberRankings,
  getUserSummary,
  getGuildsLeaderboards,
  getGuildsTotals,
}

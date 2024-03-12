const { Scenes } = require('telegraf')
const pointService = require('../services/point-service')
const texts = require('../utils/texts')

const formatPoints = (title, text, titlePadding, valuePadding) => {
    title = title.padEnd(titlePadding, ' ')
    const points = text.toString().padStart(valuePadding, ' ')
    return `*${title}* \`${points}\` pts`
}


const teamRankingsScene = new Scenes.BaseScene('team_rankings_scene')
teamRankingsScene.enter(async (ctx) => {
  try {
    const rankings = await pointService.getTeamRankings()
    let message = '🏆 *Team Rankings* 🏆\n\n'
    rankings.forEach((team, index) => {
      message += `\`${index + 1}.\` *${team.name}*: ${team.totalPoints} points\n`
    })
    await ctx.reply(message, { parse_mode: 'Markdown' })
    ctx.scene.leave()
  } catch (error) {
    await ctx.reply(texts.actions.error.error)
    console.error(error)
    ctx.scene.leave()
  }
})

const teamMemberRankingsScene = new Scenes.BaseScene('team_member_rankings_scene')
teamMemberRankingsScene.enter(async (ctx) => {
  try {
    const userId = ctx.from.id
    const rankings = await pointService.getTeamMemberRankings(userId)
    let message = '🏅 *Team Member Rankings* 🏅\n\n'
    rankings.forEach((member, index) => {
      message += `\`${index + 1}.\` *${member.username}*: ${member.totalPoints} points\n`
    })
    await ctx.reply(message, { parse_mode: 'Markdown' })
    ctx.scene.leave()
  } catch (error) {
    await ctx.reply(texts.actions.error.error)
    console.error(error)
    ctx.scene.leave()
  }
})

const userSummaryScene = new Scenes.BaseScene('user_summary_scene')
userSummaryScene.enter(async (ctx) => {
  try {
    const userId = ctx.from.id
    const [summary, ranking] = await Promise.all([
      pointService.getUserSummary(userId),
      pointService.getUserRanking(userId),
    ])
    const titlePadding = 15
    const valuePadding = 5

    let message = '📊 *Your Points Summary* 📊\n\n'
    message += `🏅 *Total*: ${summary.total} (Rank: ${ranking})\n\n`

    message += formatPoints('Exercise', summary.exercise, titlePadding, valuePadding) + '\n'
    message += formatPoints('Try Sport', summary.trySport, titlePadding, valuePadding) + '\n'
    message += formatPoints('Sports Turn', summary.sportsTurn, titlePadding, valuePadding) + '\n'
    message += formatPoints('Try Recipe', summary.tryRecipe, titlePadding, valuePadding) + '\n'
    message += formatPoints('Good Sleep', summary.goodSleep, titlePadding, valuePadding) + '\n'
    message += formatPoints('Meditate', summary.meditate, titlePadding, valuePadding) + '\n'
    message += formatPoints('Less Alcohol', summary.lessAlc, titlePadding, valuePadding) + '\n'   

    await ctx.reply(message, { parse_mode: 'Markdown' })
    ctx.scene.leave()
  } catch (error) {
    await ctx.reply(texts.actions.error.error)
    console.error(error)
    ctx.scene.leave()
  }
})

const guildComparisonScene = new Scenes.BaseScene('guild_comparison_scene')
guildComparisonScene.enter(async (ctx) => {
  try {
    const standings = await pointService.getGuildsTotals()
    const PTTotal = standings.find(guild => guild.guild === 'PT').total
    const TIKTotal = standings.find(guild => guild.guild === 'TIK').total

    let message = `*Specific Guild Standings* 🏆 \nTiK \\(${TIKTotal} pts\\) vs\\. PT \\(${PTTotal} pts\\)\n\n`

    const padding = 37

    const categories = {
      exercise: 'Exercise',
      trySport: 'Trying New Sports',
      sportsTurn: 'Sports turn Participation',
      tryRecipe: 'Trying New Recipe',
      goodSleep: 'Quality Sleep',
      meditate: 'Meditation',
      lessAlc: 'Less Alcohol'
    }

    Object.keys(categories).forEach(categoryKey => {
      message += `*${categories[categoryKey]}*\n`
      const sortedGuilds = [...standings].sort((a, b) => b[categoryKey] - a[categoryKey])
      sortedGuilds.forEach(guild => {
        const guildName = guild.guild === 'TIK' ? 'TiK' : guild.guild
        const points = `\`${guild[categoryKey].toString().padStart(3, ' ')}\` pts`
        const guildNamePadded = guildName.padEnd(padding, ' ')
        message += `${guildNamePadded} ${points}\n`
      })
      message += '\n'
    })

    await ctx.reply(message, { parse_mode: 'MarkdownV2' })
    ctx.scene.leave()
  } catch (error) {
    await ctx.reply(texts.actions.error.error)
    console.error(error)
    ctx.scene.leave()
  }
})

const guildStandingsScene = new Scenes.BaseScene('guild_standings_scene')
guildStandingsScene.enter(async (ctx) => {
  try {
    const totals = await pointService.getGuildsTotalPoints()
    totals.sort((a, b) => b.total - a.total)

    let message = '*Total Points: TiK vs PT* 🏆\n\n'

    const guildPadding = 28
    const maxPointLength = Math.max(...totals.map(guild => guild.total.toString().length))

    const isTie = totals[0].total === totals[1].total
    const emojis = isTie ? ['🤝', '🤝'] : ['🥇', '🥈']

    totals.forEach((guild, index) => {
      const guildName = guild.guild === 'TIK' ? 'TiK' : guild.guild
      const guildNamePadded = guildName.padEnd(guildPadding, ' ')
      const pointsPadded = `\`${guild.total.toString().padStart(maxPointLength, ' ')}\` pts`
      message += `${emojis[index]}${guildNamePadded}${pointsPadded}\n`
    })

    await ctx.reply(message, { parse_mode: 'Markdown' })
    ctx.scene.leave()
  } catch (error) {
    await ctx.reply(texts.actions.error.error)
    console.error(error)
    ctx.scene.leave()
  }
})


module.exports = {
  teamRankingsScene,
  teamMemberRankingsScene,
  userSummaryScene,
  guildComparisonScene,
  guildStandingsScene,
}

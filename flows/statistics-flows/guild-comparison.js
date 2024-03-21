const { Scenes } = require('telegraf')
const pointService = require('../../services/point-service')
const texts = require('../../utils/texts')
const formatList = require('../../utils/format-list')

const guildComparisonScene = new Scenes.BaseScene('guild_comparison_scene')
guildComparisonScene.enter(async (ctx) => {
  try {
    const standings = await pointService.getGuildsTotals()
    standings.sort((a, b) => b.total.average - a.total.average)

    const titlePadding = 15
    const valuePadding = 10

    let message = '*Guilds Comparison* 🏆\n\n'

    message += '*Average/Total points*\n'
    standings.forEach(guild => {
      const guildNameFixed = guild.guild === 'TIK' ? 'TiK' : guild.guild
      const text = `\(${guild.total.average.toString()}/${guild.total.total.toString()}\)`
      message += formatList(guildNameFixed, text, titlePadding, valuePadding) + '\n'
    })

    message += '\n'
    message += '*Participants*\n'
    const participants = standings.sort((a, b) => b.participants - a.participants)
    participants.forEach(guild => {
      const guildNameFixed = guild.guild === 'TIK' ? 'TiK' : guild.guild
      message += formatList(guildNameFixed, guild.participants, titlePadding, valuePadding) + '\n'
    })

    const categories = {
      exercise: 'Exercise',
      trySport: 'Trying New Sports',
      sportsTurn: 'Sports turn Participation',
      tryRecipe: 'Trying New Recipe',
      goodSleep: 'Quality Sleep',
      meditate: 'Meditation',
      lessAlc: 'Less Alcohol'
    }

    message += '\n' 
    message += '*Points per Category \\(avg/total\\):*\n\n'

    Object.keys(categories).forEach(categoryKey => {
      message += `*${categories[categoryKey]}*\n`
      const sortedGuilds = standings.sort((a, b) => b[categoryKey].average - a[categoryKey].average)
      
      sortedGuilds.forEach(guild => {
        const guildNameFixed = guild.guild === 'TIK' ? 'TiK' : guild.guild     
        const points = `\(${guild[categoryKey].average.toString()}/${guild[categoryKey].total.toString()}\)`
        message += formatList(guildNameFixed, points, titlePadding, valuePadding) + '\n'
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

module.exports = { guildComparisonScene }

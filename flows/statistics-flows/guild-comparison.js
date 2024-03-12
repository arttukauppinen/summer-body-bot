const { Scenes } = require('telegraf')
const pointService = require('../../services/point-service')
const texts = require('../../utils/texts')

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

module.exports = { guildComparisonScene }

const { Scenes } = require('telegraf')
const pointService = require('../../services/point-service')
const texts = require('../../utils/texts')
const formatList = require('../../utils/format-list')

const guildStandingsScene = new Scenes.BaseScene('guild_standings_scene')
guildStandingsScene.enter(async (ctx) => {
  try {
    const averages = await pointService.getGuildsLeaderboards()
    averages.sort((a, b) => b.average - a.average)

    let message = '*Standings \\(pts/participant\\)* 🏆\n\n'

    const guildPadding = 10
    const pointPadding = 15

    const isTie = averages[0].average === averages[1].average
    const emojis = isTie ? ['🤝', '🤝'] : ['🥇', '🥈']

    averages.forEach((guild, index) => {
      const guildName = guild.guild === 'TIK' ? 'TiK' : guild.guild
      const pointsText = guild.average.toString()
      message += emojis[index] + formatList(guildName, pointsText, guildPadding, pointPadding) + '\n'
    })

    await ctx.reply(message, { parse_mode: 'MarkdownV2' })
    ctx.scene.leave()
  } catch (error) {
    await ctx.reply(texts.actions.error.error)
    console.error(error)
    ctx.scene.leave()
  }
})

module.exports = { guildStandingsScene }

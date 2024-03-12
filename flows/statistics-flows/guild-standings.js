const { Scenes } = require('telegraf')
const pointService = require('../../services/point-service')
const texts = require('../../utils/texts')

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

module.exports = { guildStandingsScene }
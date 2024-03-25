const { Scenes } = require('telegraf')
const pointService = require('../../services/point-service')
const texts = require('../../utils/texts')
const { formatList, escapeMarkdownV2 } = require('../../utils/format-list')

const teamMemberRankingsScene = new Scenes.BaseScene('team_member_rankings_scene')
teamMemberRankingsScene.enter(async (ctx) => {
  try {
    const userId = ctx.from.id
    const rankings = await pointService.getTeamMemberRankings(userId)
    let message = `*${escapeMarkdownV2(rankings[0].teamName)} Rankings* 🏅\n\n`
    const titlePadding = 20
    const valuePadding = 6

    rankings.forEach((member, index) => {
      const rank = (index + 1).toString() + '.'
      const points = member.totalPoints.toString()
      message += formatList(rank + ' ' + member.name, points, titlePadding, valuePadding, 'pts') + '\n'
    })

    await ctx.reply(message, { parse_mode: 'MarkdownV2' })
    ctx.scene.leave()
  } catch (error) {
    await ctx.reply(texts.actions.error.error)
    console.error(error)
    ctx.scene.leave()
  }
})

module.exports = { teamMemberRankingsScene }

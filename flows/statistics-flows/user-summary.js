const { Scenes } = require('telegraf')
const pointService = require('../../services/point-service')
const texts = require('../../utils/texts')
const formatList = require('../../utils/format-list')

const userSummaryScene = new Scenes.BaseScene('user_summary_scene')
userSummaryScene.enter(async (ctx) => {
  try {
    const userId = ctx.from.id
    const [summary] = await Promise.all([
      pointService.getUserSummary(userId),
    ])
    const titlePadding = 17
    const valuePadding = 5

    let message = '*Your Points Summary* 📊\n\n'
    message += `*Total of* ${summary.total} pts \n\n`

    message += formatList('Exercise', summary.exercise, titlePadding, valuePadding, 'pts') + '\n'
    message += formatList('Try Sport', summary.trySport, titlePadding, valuePadding, 'pts') + '\n'
    message += formatList('Sports Turn', summary.sportsTurn, titlePadding, valuePadding, 'pts') + '\n'
    message += formatList('Try Recipe', summary.tryRecipe, titlePadding, valuePadding, 'pts') + '\n'
    message += formatList('Good Sleep', summary.goodSleep, titlePadding, valuePadding, 'pts') + '\n'
    message += formatList('Meditate', summary.meditate, titlePadding, valuePadding, 'pts') + '\n'
    message += formatList('Less Alcohol', summary.lessAlc, titlePadding, valuePadding, 'pts') + '\n'   

    await ctx.reply(message, { parse_mode: 'MarkdownV2' })
    ctx.scene.leave()
  } catch (error) {
    await ctx.reply(texts.actions.error.error)
    console.error(error)
    ctx.scene.leave()
  }
})

module.exports = { userSummaryScene }

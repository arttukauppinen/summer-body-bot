const { Scenes } = require('telegraf')
const texts = require('../utils/texts.js')

const startWizard = new Scenes.WizardScene(
  'start_wizard',
  async (ctx) => {
    await ctx.reply(texts.actions.start.introduction)
    await ctx.reply(texts.actions.start.instructions)
    await ctx.scene.leave()
  }
)

module.exports = { startWizard }

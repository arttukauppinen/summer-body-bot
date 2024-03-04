const { Scenes } = require('telegraf')
const texts = require('../utils/texts.js')

const startWizard = new Scenes.WizardScene(
  'start_wizard',
  (ctx) => {
    ctx.reply(texts.actions.start.introduction)
      .then(() => {
        ctx.reply(texts.actions.start.instructions)
      })
      .then(() => {
        ctx.scene.leave()
      })
  }
)

module.exports = { startWizard }

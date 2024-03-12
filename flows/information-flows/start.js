const { Scenes } = require('telegraf')

const startWizard = new Scenes.WizardScene(
  'start_wizard',
  async (ctx) => {
    let introductionMessage = '*Welcome to the Kesäkuntoon Competition\\!* 🎉\n\n'
    introductionMessage += 'This initiative, organized by TiK and PT, is designed to encourage a healthier lifestyle through friendly competition\\. As a participant, you\'ll earn points by engaging in various health and fitness activities, contributing both to your personal score and your team\'s overall performance\\.\n\n'
    introductionMessage += '_Every point counts\\!_'
    await ctx.reply(introductionMessage, { parse_mode: 'MarkdownV2' })

    let instructionsMessage = '*Getting Started:*\n\n'
    instructionsMessage += '1\\. *Register*: Begin by registering with the command /register\\.\n\n'
    instructionsMessage += '2\\. *Form a Team*: Team up with up to three other members from either TiK or PT guilds\\. Each team member needs to be from same guild\n\n'
    instructionsMessage += '3\\. *Team Changes*: By default, you will join or create a team upon registering\\. However, you can join, create, or change your Kesäkuntoon team later using the /createteam or /jointeam commands\\. You have until the first Sunday of this competition to finalize your team selection\\.\n\n'
    instructionsMessage += '4\\. *Earning Points & Tracking Progress*: Use /howtogetpoints to learn how to get points\\. Amp up the excitement by checking rankings and stats — learn more with command /statsinfo\\.\n\n'
    instructionsMessage += '5\\. *Assistance*: Need help\\? The /help command lists all available commands and their functions\\.\n\n'
    await ctx.reply(instructionsMessage, { parse_mode: 'MarkdownV2' })

    await ctx.scene.leave()
  }
)

module.exports = { startWizard }

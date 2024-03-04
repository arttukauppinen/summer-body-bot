const { Scenes } = require('telegraf')
const teamService = require('../services/team-service')

const createTeamWizard = new Scenes.WizardScene(
  'create_team_wizard',
  (ctx) => {
    ctx.reply('Give a name for your team:')
    return ctx.wizard.next()
  },
  async (ctx) => {
    const teamName = ctx.message.text
    try {
      await teamService.createTeam(teamName)
      ctx.reply('Team added!')
    } catch (error) {
      if (error.code === 11000) { // Mongoose duplicate key error
        ctx.reply('A team with that name already exists. Please try a different name.')
      } else {
        ctx.reply('An error occurred while creating your team.')
      }
    }
    return ctx.scene.leave()
  }
)

module.exports = { createTeamWizard }

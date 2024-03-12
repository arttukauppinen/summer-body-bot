const { Scenes, Markup } = require('telegraf')
const teamService = require('../services/team-service')
const userService = require('../services/user-service')
const texts = require('../utils/texts')

const createTeamWizard = new Scenes.WizardScene(
  'create_team_wizard',
  async (ctx) => {
    const userId = ctx.from.id
    const user = await userService.findUser(userId)

    if (!user) {
        await ctx.reply('User not found. Please /register first.')
        return ctx.scene.leave()
    }

    if (user && user.team) {
      await ctx.reply(
        'You are currently part of a team. By creating a new team, you will automatically leave your current team. ' +
        'If your current team is left with no members, it will be permanently removed. ' +
        'Do you wish to continue?',
        Markup.inlineKeyboard([
          Markup.button.callback('Yes, create new team', 'confirm_create_team'),
          Markup.button.callback('No, cancel', 'cancel_create_team')
        ])
      )
      return ctx.wizard.next()
    } else {
      await ctx.reply('You are not currently part of any team. Please provide a name for your new team.')
      ctx.wizard.state.confirmCreate = true
      return ctx.wizard.next()
    }
  },
  async (ctx) => {
    if (ctx.wizard.state.confirmCreate) {                
      const teamName = ctx.message.text
      const userId = ctx.from.id
      const user = await userService.findUser(userId)

      if (!teamName || teamName.length > 15) {
        await ctx.reply('The team name you provided is not valid. Please ensure it is less than 15 characters long.')
        return ctx.wizard.selectStep(ctx.wizard.cursor)
      }

      try {
        const team = await teamService.createTeam(teamName, user.guild)

        user.team && await teamService.leaveTeam(user._id, user.team)
        await userService.addUserToTeam(user._id, team._id)
        await teamService.joinTeam(user._id, team._id)

        await ctx.reply('Team has been successfully created! Other members can join your team using this ID:')
        await ctx.reply(`${team._id}`)
        return ctx.scene.leave()
      } catch (error) {

        if (error.code === 11000) {
          await ctx.reply('A team with that name already exists. Please try a different name.')
          return ctx.wizard.selectStep(ctx.wizard.cursor)
        } else {
          await ctx.reply(texts.actions.error.error)
          return ctx.scene.leave()
        }
      }
    } else {
      await ctx.reply('Team creation canceled.')
      return ctx.scene.leave()
    }
  }
)

createTeamWizard.action('confirm_create_team', async (ctx) => {
  ctx.wizard.state.confirmCreate = true

  await ctx.answerCbQuery()
  await ctx.editMessageText('Please provide a name for your new team.')
})

createTeamWizard.action('cancel_create_team', async (ctx) => {
  ctx.wizard.state.confirmCreate = false

  await ctx.answerCbQuery()
  await ctx.editMessageText('Team creation canceled.')
  return ctx.scene.leave()
})

module.exports = { createTeamWizard }

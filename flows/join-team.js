const { Scenes, Markup } = require('telegraf')
const teamService = require('../services/team-service')
const userService = require('../services/user-service')
const texts = require('../utils/texts')

const cancelAndExitKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('Cancel', 'cancel')
])

const joinTeamWizard = new Scenes.WizardScene(
  'join_team_wizard',
  async (ctx) => {
    const userId = ctx.from.id
    const user = await userService.findUser(userId)

    if (!user) {
      await ctx.reply('User not found. Please /register first.')
      return ctx.scene.leave()
    }

    if (user && user.team) {
      await ctx.reply(
        'You are already part of a team. By joining a new team, you will automatically leave your current team. ' +
        'If your current team is left with no members, it will be permanently removed. ' +
        'Do you wish to continue?',
        Markup.inlineKeyboard([
          Markup.button.callback('Yes, join new team', 'confirm_join_team'),
          Markup.button.callback('No, cancel', 'cancel_join_team')
        ])
      )
      return ctx.wizard.next()
    } else {
      ctx.wizard.state.confirmJoin = true
      await ctx.reply('You are not part of a team. Please enter the ID of the team you wish to join or use buttons below.', cancelAndExitKeyboard)
      return ctx.wizard.next()
    }
  },
  async (ctx) => {
    if (ctx.wizard.state.confirmJoin) {
      if ('text' in ctx.message) {
        const teamId = ctx.message.text
        const userId = ctx.from.id
        const user = await userService.findUser(userId)

        if (!teamId) {
          await ctx.reply('No team ID provided. Please provide a valid team ID.')
          return ctx.wizard.selectStep(ctx.wizard.cursor)
        }

        try {
          const team = await teamService.getTeamById(teamId)

          if (!team) {
            await ctx.reply('No team found with the provided ID. Please check the ID and try again.', cancelAndExitKeyboard)
            return ctx.wizard.selectStep(ctx.wizard.cursor)
          }

          if (user.guild !== team.guild) {
            await ctx.reply('You cannot join a team that belongs to a different guild. Start over with /jointeam')
            return ctx.scene.leave()
          }

          if (user.team) {
            await teamService.leaveTeam(user._id, user.team)
          }

          await userService.addUserToTeam(user._id, team._id)
          await teamService.joinTeam(user._id, team._id)

          await ctx.reply(`Successfully joined team ${team.name}!`)
          return ctx.scene.leave()
        } catch (error) {
            await ctx.reply('Invalid team ID format. Start over with /jointeam')
            return ctx.scene.leave()
        }
      } else {
        await ctx.reply('Please enter the team ID.', cancelAndExitKeyboard)
        return ctx.wizard.selectStep(ctx.wizard.cursor)
      }
    } else {
      ctx.reply(texts.actions.error.error)
      return ctx.wizard.exit()
    }
  }
)

joinTeamWizard.action('confirm_join_team', async (ctx) => {
  ctx.wizard.state.confirmJoin = true
  await ctx.answerCbQuery()
  await ctx.editMessageText('Please enter the ID of the team you wish to join.',
    Markup.inlineKeyboard([
        Markup.button.callback('Cancel', 'cancel_join_team')
    ])
  )
})

joinTeamWizard.action('cancel_join_team', async (ctx) => {
  ctx.wizard.state.confirmJoin = false
  await ctx.answerCbQuery()
  await ctx.editMessageText('Joining team canceled.')
  return ctx.scene.leave()
})

module.exports = { joinTeamWizard }

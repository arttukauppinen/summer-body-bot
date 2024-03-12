const { Scenes, Markup } = require('telegraf')
const userService = require('../services/user-service')
const texts = require('../utils/texts')

const deleteUserWizard = new Scenes.WizardScene(
  'delete_user_wizard',
  async (ctx) => {
    await ctx.reply(
      'Confirm user deletion? This action will also remove the user from their current team and, if it results in an empty team, delete the team as well. This cannot be undone.',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes, delete', 'confirm_delete'),
        Markup.button.callback('No, cancel', 'cancel_delete')
      ])
    )
    return ctx.wizard.next()
  }
)

deleteUserWizard.action('confirm_delete', async (ctx) => {
  await ctx.answerCbQuery()
  const userId = ctx.from.id
  const user = userService.findUser(userId)
  try {
    user.team && await teamService.leaveTeam(user._id, user.team)
    const deletionResult = await userService.deleteUser(userId)
    if (deletionResult.deletedCount === 0) {
      await ctx.editMessageText('User not found or already deleted.')
    } else {
      await ctx.editMessageText('User deleted.')
    }
  } catch (error) {
    await ctx.reply(texts.actions.error.error)
    console.error(error)
  }
  return ctx.scene.leave()
})

deleteUserWizard.action('cancel_delete', async (ctx) => { 
  await ctx.answerCbQuery()
  await ctx.editMessageText('Deletion canceled.')
  return ctx.scene.leave()
})

module.exports = { deleteUserWizard }

const { Scenes, Markup } = require('telegraf')
const teamService = require('../services/team-service')
const userService = require('../services/user-service')
const texts = require('../utils/texts')

const registerWizard = new Scenes.WizardScene(
  'register_wizard',
  async (ctx) => {
    const userId = ctx.from.id
    const user = await userService.findUser(userId)
    if (user) {
        await ctx.reply("You've already registered. You can still /createteam or /jointeam")
        return ctx.scene.leave()
    } else {
        await ctx.reply(texts.terms.question, Markup.inlineKeyboard([
            Markup.button.callback('Accept', 'accept_terms'),
            Markup.button.callback('Decline', 'decline_terms')
        ]))
        return ctx.wizard.next()
    }
  },
  // Callback handlers below manage term acceptance and guild/team selection
  async (ctx) => {
    const userId = ctx.from.id
    const user = await userService.findUser(userId)
    if (ctx.wizard.state.action === 'create' && user) {
      const teamName = ctx.message.text
      if (!teamName || teamName.length > 15) {
        await ctx.reply('The team name you provided is not valid. Please ensure the team name is less than 15 characters long.')
        return ctx.wizard.selectStep(ctx.wizard.cursor)
      }
      try {
        const team = await teamService.createTeam(teamName, ctx.wizard.state.guild)
        await userService.addUserToTeam(user._id, team._id)
        await teamService.joinTeam(user._id, team._id)
        await ctx.reply('Team has been successfully created! Other members can join your team using this ID:')
        ctx.reply(`${team._id}`)
      } catch (error) {
        if (error.code === 11000) { // Mongoose duplicate key error
          await ctx.reply('A team with that name already exists. Please try a different name.')
          return ctx.wizard.selectStep(ctx.wizard.cursor)
        } else {
          await ctx.reply(texts.actions.error.error)
          return ctx.scene.leave()
        }
      }
    } else if (ctx.wizard.state.action === 'join') {
      const teamId = ctx.message.text
      try {
        const team = await teamService.getTeamById(teamId)
        if (!team) {
          await ctx.reply('No team with that ID found. Please ensure you\'ve entered it correctly and try again.')
          return ctx.wizard.selectStep(ctx.wizard.cursor)
        }
        if (user.guild !== team.guild) {
          await ctx.reply('You cannot join a team that belongs to a different guild.')
          return ctx.wizard.selectStep(ctx.wizard.cursor)
        }
        await userService.addUserToTeam(user._id, team._id)
    
        await ctx.reply(`Successfully joined ${team.name}!`)
        return ctx.scene.leave()
      } catch (error) {
        await ctx.reply('Invalid team ID format. Start over with /jointeam')
        return ctx.scene.leave()
    }
    }
    
    return ctx.scene.leave()
  }
)

registerWizard.action('accept_terms', async (ctx) => {
  await ctx.answerCbQuery()
  await ctx.editMessageText('You accepted the terms and conditions.')
  await ctx.reply(
    'Please select your guild:',
    Markup.inlineKeyboard([
        Markup.button.callback('PT', 'select_guild_PT'),
        Markup.button.callback('TiK', 'select_guild_TIK'),
        Markup.button.callback('Cancel & Exit', 'exit_wizard')
    ])
  )
})

registerWizard.action('decline_terms', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.editMessageText('You did not accept the terms and conditions necessary to enter the competition. Click /register to start again.')
    return ctx.scene.leave()
})

registerWizard.action(/^select_guild_(.+)$/, async (ctx) => {
    await ctx.answerCbQuery()
    const guild = ctx.match[1]

    ctx.wizard.state.guild = guild
    const firstName = ctx.from.first_name || ''
    const lastName = ctx.from.last_name || ''
    const fullName = `${firstName} ${lastName}`.trim() || ctx.from.username

    try {
        await userService.createUser({
            userId: ctx.from.id,
            username: ctx.from.username,
            name: fullName,
            guild: guild,
        })
        await ctx.editMessageText(`You successfully registered with the ${guild === 'TIK' ? 'TiK' : guild} Kesäkuntoon team`)
        await ctx.reply(
          'Would you like to create a new team or join an existing one?',
          Markup.inlineKeyboard([
            Markup.button.callback('Create new team', 'new_team'),
            Markup.button.callback('Join existing team', 'existing_team'),
            Markup.button.callback('Cancel & Exit', 'exit_wizard')
          ]),
          { parse_mode: 'Markdown' }
        )
    } catch (error) {
        await ctx.editMessageText(texts.actions.error.error)
        return ctx.scene.leave()
    }
})

registerWizard.action('new_team', async (ctx) => {
  ctx.wizard.state.action = 'create'

  await ctx.answerCbQuery()
  await ctx.editMessageText('You chose to create a new team. Give name for your team')

})

registerWizard.action('existing_team', async (ctx) => {
  ctx.wizard.state.action = 'join'

  await ctx.answerCbQuery()
  await ctx.editMessageText('You chose to join an existing team. Enter the team ID you wish to join. This ID was provided when the team was initially created.')
})

registerWizard.action('exit_wizard', async (ctx) => {
  await ctx.editMessageText('Canceled & Exited. Start again with /weekscores')
  return ctx.scene.leave()
})

module.exports = { registerWizard }

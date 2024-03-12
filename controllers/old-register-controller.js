const { Scenes } = require('telegraf')
const teamService = require('../services/team-service')
const userService = require('../services/user-service')
const texts = require('../utils/texts')

const registerWizard = new Scenes.WizardScene(
  'register_wizard',
  async (ctx) => {
    // Check if the user has already registered
    const userId = ctx.from.id
    const user = await userService.findUser(userId)
    if (user) {
      await ctx.reply("You've already registered.")
      return ctx.scene.leave()
    } else {
      await ctx.reply('To register your user, you need to accept these terms and conditions:')
      await ctx.reply(texts.terms.only_terms)
      await ctx.reply('Do you accept these conditions? /yes /no')
      return ctx.wizard.next()
    }
  },
  (ctx) => {
    // Handle terms and conditions response
    const acceptance = ctx.message.text.toLowerCase()
    if (acceptance !== '/yes' || acceptance !== 'yes') {
      ctx.reply("To participate in this competition, it's necessary to accept our terms and conditions.")
      return ctx.scene.leave()
    } else {
      ctx.reply('Great! Please select your guild: /PT or /TiK.')
      return ctx.wizard.next()
    }
  },
  async (ctx) => {
    // Handle guild selection
    const guild = ctx.message.text.toUpperCase()
    if (guild !== '/PT' && guild !== '/TIK') {
      await ctx.reply('Please select a valid guild: /PT or /TiK.')
      return
    }

    // Create user after guild selection
    const userId = ctx.from.id
    const username = ctx.from.username

    try {
      await userService.createUser({
        userId: userId,
        username: username,
        guild: guild.replace('/', ''),
      })
      ctx.wizard.state.guild = guild.replace('/', '')
      await ctx.reply('*You have been registered successfully.*\n\nWould you like to create a new team or join an existing one? Please choose */newteam* or */existingteam*.', { parse_mode: 'Markdown' })
      return ctx.wizard.next()
    } catch (error) {
      await ctx.reply('An error occurred while creating your user profile.')
      console.error(error)
      return ctx.scene.leave()
    }
  },
  (ctx) => {
    // Handle decision for new or existing team
    const decision = ctx.message.text.toLowerCase()
    if (decision === '/newteam') {
      ctx.reply('Please provide a name for your new team.')
      ctx.wizard.state.action = 'create'
      return ctx.wizard.next()
    } else if (decision === '/existingteam') {
      ctx.reply('Please enter the team ID you wish to join. This ID was provided when the team was initially created.')
      ctx.wizard.state.action = 'join'
      return ctx.wizard.next()
    } else {
      ctx.reply('Please choose /newteam or /existingteam.')
      return
    }
  },
  async (ctx) => {
    // Handle new team creation or joining an existing team
    const userId = ctx.from.id
    const user = await userService.findUser(userId)
    if (ctx.wizard.state.action === 'create' && user) {
      const teamName = ctx.message.text
      if (!teamName || teamName.length < 3 || teamName.length > 15) {
        ctx.reply('The team name you provided is not valid. Please ensure the team name is between 3 and 15 characters long.')
        return
      }
      try {
        const team = await teamService.createTeam(teamName, ctx.wizard.state.guild)
        await userService.addUserToTeam(user._id, team._id)
        await teamService.joinTeam(user._id, team._id)
        ctx.reply(`Your team has been successfully created! Other members can join your team using the provided ID: ${team._id}`)
      } catch (error) {
        if (error.code === 11000) { // Mongoose duplicate key error
          ctx.reply('A team with that name already exists. Please try a different name.')
        } else {
          ctx.reply(texts.actions.error.error)
        }
      }
    } else if (ctx.wizard.state.action === 'join') {
      const teamId = ctx.message.text
      try {
        const team = await teamService.getTeamById(teamId)
        if (!team) {
          await ctx.reply('No team with that ID exists. Please ensure you\'ve entered it correctly and try again.')
          return ctx.wizard.selectStep(ctx.wizard.cursor)
        }
    
        const userId = ctx.from.id
        await userService.addUserToTeam(userId, team._id)
    
        await ctx.reply(`Successfully joined ${team.name}!`)
        return ctx.scene.leave()
      } catch (error) {
        await ctx.reply('An error occurred while trying to join the team.')
        return ctx.scene.leave()
      }
    }
    
    return ctx.scene.leave()
  }
)

module.exports = { registerWizard }

const { Scenes } = require('telegraf')
const userService = require('../services/user-service')

//TODO: logiikka pitää fiksaa jotenkin, mutta vois toteuttaa jo testin miten menis db
const addWeeklyPointsWizard = new Scenes.WizardScene(
  'add_weekly_points_wizard',
  async (ctx) => {
    console.log("wtf")
    ctx.reply('How many hours did you do sports?')
    return ctx.wizard.next()
  },
  async (ctx) => {
    ctx.wizard.state.sport = Number(ctx.message.text)
    ctx.reply('How many days you got more than 7 hours sleep?')
    return ctx.wizard.next()
  },
  async (ctx) => {
    ctx.wizard.state.sleep = Number(ctx.message.text)
    ctx.reply('How many minutes did you meditate?')
    return ctx.wizard.next()
  },
  async (ctx) => {
    ctx.wizard.state.meditation = Number(ctx.message.text)

    const pointsData = {
      week: getCurrentWeek(), //TODO: Logic for this :D
      sport: ctx.wizard.state.sport,
      sleep: ctx.wizard.state.sleep,
      meditation: ctx.wizard.state.meditation,
      other: 0,
    }
    
    try {
      await userService.saveWeeklyPoints(ctx.from.id, pointsData)
      ctx.reply('Scores saved!')
    } catch (error) {
      console.log(error)
      ctx.reply('An error occurred while saving your scores.')
    }

    return ctx.scene.leave() 
  }
)

module.exports = { addWeeklyPointsWizard }

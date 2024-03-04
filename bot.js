const { Telegraf, Scenes, session } = require('telegraf')
const { telegramToken } = require('./config')

const bot = new Telegraf(telegramToken)

//pidä nämä samassa järjestyksessä stagen arrayn mukaan ja samoin commandit samassa järjestyksessä. 
//samoin edes jotenkin loogisessa järjestyksessä botin flown mukaan

const { startWizard } = require('./controllers/start-controller')
const { createTeamWizard } = require('./controllers/create-team-controller')
const { addWeeklyPointsWizard } = require('./controllers/weekly-points-controller')

const stage = new Scenes.Stage([
                startWizard,
                createTeamWizard,
                addWeeklyPointsWizard, 
              ])

bot.use(session()) //TODO: Change to use mongoDb session etc
bot.use(stage.middleware())

bot.command('start', (ctx) => {
  ctx.scene.enter('start_wizard')
})

bot.command('createteam', (ctx) => {
  ctx.scene.enter('create_team_wizard');
})

bot.command('addweeklypoints', (ctx) => {
  ctx.scene.enter('add_weekly_points_wizard')
})

bot.catch((err, ctx) => {
  console.log(`Encountered an error for ${ctx.updateType}`, err)
})

module.exports = bot

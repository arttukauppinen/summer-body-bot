const { Telegraf, Scenes, session } = require('telegraf')
const { telegramToken } = require('./config')
const bot = new Telegraf(telegramToken)

const { startWizard } = require('./controllers/start-controller')
const { deleteUserWizard } = require('./controllers/delete-user-controller')
const { registerWizard } = require('./controllers/register-controller')
const { createTeamWizard } = require('./controllers/create-team-controller')
const { joinTeamWizard } = require('./controllers/join-team-controller')
const { weekScoresWizard } = require('./controllers/week-scores-controller')
const {
  teamRankingsScene, 
  teamMemberRankingsScene, 
  userSummaryScene, 
  guildStandingsScene,
  guildComparisonScene
} = require('./controllers/leaderboards-controller')


const stage = new Scenes.Stage([
                startWizard,
                deleteUserWizard,
                registerWizard,
                createTeamWizard,
                joinTeamWizard,
                weekScoresWizard,
                teamRankingsScene,
                teamMemberRankingsScene,
                userSummaryScene,
                guildStandingsScene,
                guildComparisonScene,
              ])

bot.use(session()) //TODO: Change to use mongoDb session etc
bot.use(stage.middleware())

bot.command('start', (ctx) => { ctx.scene.enter('start_wizard') })
bot.command('rmuser', (ctx) => { ctx.scene.enter('delete_user_wizard') })
bot.command('register', (ctx) => { ctx.scene.enter('register_wizard') })
bot.command('createteam', (ctx) => { ctx.scene.enter('create_team_wizard') })
bot.command('jointeam', (ctx) => { ctx.scene.enter('join_team_wizard') })
bot.command('weekscores', (ctx) => { ctx.scene.enter('week_scores_wizard') })

bot.command('leaderboards', (ctx) => { ctx.scene.enter('team_rankings_scene') })
bot.command('team', (ctx) => { ctx.scene.enter('team_member_rankings_scene') })
bot.command('summary', (ctx) => { ctx.scene.enter('user_summary_scene') })
bot.command('tikvspt', (ctx) => { ctx.scene.enter('guild_standings_scene') })
bot.command('tikvsptall', (ctx) => { ctx.scene.enter('guild_comparison_scene') })

bot.catch((err, ctx) => { 
  console.error(`Encountered an error for ${ctx.updateType}`, err) 
  ctx.reply(texts.actions.error.error)
})

module.exports = bot

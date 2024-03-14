const { Telegraf, Scenes, session } = require('telegraf')
const { telegramToken } = require('./config')
//const bot = new Telegraf(telegramToken)
const https = require('https')

const agent = new https.Agent({
  keepAlive: false,
})

const bot = new Telegraf(telegramToken, {
  telegram: { agent },
})

const { startWizard } = require('./flows/information-flows/start')
const { howToGetPoints } = require('./flows/information-flows/how-to-points')
const { statsInfoScene } = require('./flows/information-flows/stats-info')
const { helpScene } = require('./flows/information-flows/help')
const { termsScene } = require('./flows/information-flows/terms')

const { deleteUserWizard } = require('./flows/delete-user')
const { registerWizard } = require('./flows/register')
const { createTeamWizard } = require('./flows/create-team')
const { joinTeamWizard } = require('./flows/join-team')
const { weekScoresWizard } = require('./flows/week-scores')

const { teamRankingsScene } = require('./flows/statistics-flows/team-rankings')
const { teamMemberRankingsScene } = require('./flows/statistics-flows/team-member-rankings')
const { userSummaryScene } = require('./flows/statistics-flows/user-summary')
const { guildStandingsScene } = require('./flows/statistics-flows/guild-standings')
const { guildComparisonScene } = require('./flows/statistics-flows/guild-comparison')

const onlyPrivate = require('./utils/check-private')
const isCompetitionActive = require('./utils/is-comp-active')

const texts = require('./utils/texts')

const stage = new Scenes.Stage([
                startWizard,
                howToGetPoints,
                statsInfoScene,
                helpScene,
                termsScene,
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

// bot.on('message', (ctx) => {
//   if (ctx.message.sticker) {
//     console.log("sticker id", ctx.message.sticker.file_id)
//   }
// })

bot.command('start', isCompetitionActive, onlyPrivate, (ctx) => { ctx.scene.enter('start_wizard') })
bot.command('howtogetpoints', isCompetitionActive, onlyPrivate, (ctx) => { ctx.scene.enter('how_to_get_points_scene') })
bot.command('statsinfo', isCompetitionActive, onlyPrivate, (ctx) => { ctx.scene.enter('stats_info_scene') })
bot.command('help', isCompetitionActive, (ctx) => { ctx.scene.enter('help_scene') })
bot.command('terms', isCompetitionActive, onlyPrivate, (ctx) => { ctx.scene.enter('terms_scene') })

bot.command('rmuser', isCompetitionActive, onlyPrivate, (ctx) => { ctx.scene.enter('delete_user_wizard') })
bot.command('register', isCompetitionActive, onlyPrivate, (ctx) => { ctx.scene.enter('register_wizard') })
bot.command('createteam', isCompetitionActive, onlyPrivate, (ctx) => { ctx.scene.enter('create_team_wizard') })
bot.command('jointeam', isCompetitionActive, onlyPrivate, (ctx) => { ctx.scene.enter('join_team_wizard') })
bot.command('weekscores', isCompetitionActive, onlyPrivate, (ctx) => { ctx.scene.enter('week_scores_wizard') })

bot.command('leaderboards', isCompetitionActive, (ctx) => { ctx.scene.enter('team_rankings_scene') })
bot.command('team', isCompetitionActive, (ctx) => { ctx.scene.enter('team_member_rankings_scene') })
bot.command('summary', isCompetitionActive, (ctx) => { ctx.scene.enter('user_summary_scene') })
bot.command('tikvspt', isCompetitionActive, (ctx) => { ctx.scene.enter('guild_standings_scene') })
bot.command('tikvsptall', isCompetitionActive, (ctx) => { ctx.scene.enter('guild_comparison_scene') })

bot.command('dumbahhbot', (ctx) => { ctx.reply('yo mama')})

bot.catch((err, ctx) => { 
  console.error(`Encountered an error for ${ctx.updateType}`, err) 
  ctx.reply(texts.actions.error.error)
})

module.exports = bot
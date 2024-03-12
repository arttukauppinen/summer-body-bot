const { Scenes, Markup } = require('telegraf')
const pointService = require('../services/point-service')
const userService = require('../services/user-service')
const texts = require('../utils/texts')

const weekScoresWizard = new Scenes.WizardScene(
  'week_scores_wizard',
  async (ctx) => {
    const userId = ctx.from.id
    const user = await userService.findUser(userId)

    if (!user) {
      await ctx.reply('User not found. Please /register first.')
      return ctx.scene.leave()
    }

    await ctx.reply('How many times did you exercise for at least 45 minutes? One exercise session can contain multiple times Enter a number from 0 to 14:')
    return ctx.wizard.next()
  },  
  async (ctx) => {
    const exerciseTimes = parseInt(ctx.message.text)

    if (!Number.isInteger(exerciseTimes) || exerciseTimes < 0 || exerciseTimes > 14) {
      await ctx.reply('Invalid input. Please enter a whole number from 0 to 14 representing how many 45-minute intervals you exercised.')
      return ctx.wizard.selectStep(ctx.wizard.cursor)
    }

    ctx.wizard.state.pointsData = { exercise: 0, trySport: 0, sportsTurn: 0, tryRecipe: 0, goodSleep:0, meditate: 0, lessAlc: 0, total: 0 }
    ctx.wizard.state.pointsData.exercise = exerciseTimes
    ctx.wizard.state.pointsData.total += exerciseTimes

    await ctx.reply(
      'Did you try a new sport or a sport you have not done in a long time?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'yes_new_sport'),
        Markup.button.callback('No', 'no_new_sport')
      ])
    )
  },
  async (ctx) => {
    await ctx.reply(
      'Did you attend on a weekly sports turn on Thursday?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'yes_sports_turn'),
        Markup.button.callback('No', 'no_sports_turn')
      ])
    )
  },
  async (ctx) => {
    await ctx.reply(
      'Did you try new recipe this week?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'yes_try_recipe'),
        Markup.button.callback('No', 'no_try_recipe')
      ])
    )
  },
  async (ctx) => {
    await ctx.reply(
      'Did you sleep 7 or more hours at least 5 times this week?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'yes_good_sleep'),
        Markup.button.callback('No', 'no_good_sleep')
      ])
    )
  },
  async (ctx) => {
    await ctx.reply(
      'Did you meditate for 10 minutes at least five times this week?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'yes_meditate'),
        Markup.button.callback('No', 'no_meditate')
      ])
    )
  },
  async (ctx) => {
    await ctx.reply(
      'Did you have less than 7 portions of alcohol this week?',
      Markup.inlineKeyboard([
        Markup.button.callback('Yes', 'yes_less_alcohol'),
        Markup.button.callback('No', 'no_less_alcohol')
      ])
    )
  },
  async (ctx) => {
    let message  = 'Here is your point summary:\n\n'
        message += `Exercise Sessions: ${ctx.wizard.state.pointsData.exercise}\n`
        message += `Tried a New Sport: ${ctx.wizard.state.pointsData.trySport ? 'Yes' : 'No'}\n`
        message += `Attended Sports Turn: ${ctx.wizard.state.pointsData.sportsTurn ? 'Yes' : 'No'}\n`
        message += `Tried a New Recipe: ${ctx.wizard.state.pointsData.tryRecipe ? 'Yes' : 'No'}\n`
        message += `Had Good Sleep: ${ctx.wizard.state.pointsData.goodSleep ? 'Yes' : 'No'}\n`
        message += `Meditated: ${ctx.wizard.state.pointsData.meditate ? 'Yes' : 'No'}\n`
        message += `Limited Alcohol: ${ctx.wizard.state.pointsData.lessAlc ? 'Yes' : 'No'}\n`
        message += `Total Points: ${ctx.wizard.state.pointsData.total}\n\n`
        message += 'Do you confirm these details?'

    await ctx.reply(
      message,
      Markup.inlineKeyboard([
        Markup.button.callback('Yes, confirm', 'confirm_details'),
        Markup.button.callback('No, start over', 'start_over')
      ])
    )
  },
)

weekScoresWizard.action(/^(yes|no)_new_sport$/, async (ctx) => {
  const actionResponse = ctx.match[1]

  if (actionResponse === 'yes') {
    ctx.wizard.state.pointsData.trySport = 1
    ctx.wizard.state.pointsData.total += 1
  }

  await ctx.deleteMessage()
  ctx.wizard.next()
  await ctx.wizard.steps[ctx.wizard.cursor](ctx)
  await ctx.answerCbQuery()
})

weekScoresWizard.action(/^(yes|no)_sports_turn$/, async (ctx) => {
  const actionResponse = ctx.match[1]

  if (actionResponse === 'yes') {
    ctx.wizard.state.pointsData.sportsTurn = 1
    ctx.wizard.state.pointsData.total += 1
  }

  await ctx.deleteMessage()
  ctx.wizard.next()
  await ctx.wizard.steps[ctx.wizard.cursor](ctx)
  await ctx.answerCbQuery()
})

weekScoresWizard.action(/^(yes|no)_try_recipe$/, async (ctx) => {
  const actionResponse = ctx.match[1]

  if (actionResponse === 'yes') {
    ctx.wizard.state.pointsData.tryRecipe = 1
    ctx.wizard.state.pointsData.total += 1
  }

  await ctx.deleteMessage()
  ctx.wizard.next()
  await ctx.wizard.steps[ctx.wizard.cursor](ctx)
  await ctx.answerCbQuery()
})

weekScoresWizard.action(/^(yes|no)_good_sleep$/, async (ctx) => {
  const actionResponse = ctx.match[1]

  if (actionResponse === 'yes') {
    ctx.wizard.state.pointsData.goodSleep = 1
    ctx.wizard.state.pointsData.total += 1
  }

  await ctx.deleteMessage()
  ctx.wizard.next()
  await ctx.wizard.steps[ctx.wizard.cursor](ctx)
  await ctx.answerCbQuery()
})

weekScoresWizard.action(/^(yes|no)_meditate$/, async (ctx) => {
  const actionResponse = ctx.match[1]

  if (actionResponse === 'yes') {
    ctx.wizard.state.pointsData.meditate = 1
    ctx.wizard.state.pointsData.total += 1
  }

  await ctx.deleteMessage()
  ctx.wizard.next()
  await ctx.wizard.steps[ctx.wizard.cursor](ctx)
  await ctx.answerCbQuery()
})

weekScoresWizard.action(/^(yes|no)_less_alcohol$/, async (ctx) => {
  const actionResponse = ctx.match[1]

  if (actionResponse === 'yes') {
    ctx.wizard.state.pointsData.lessAlc = 1
    ctx.wizard.state.pointsData.total += 1
  }

  await ctx.deleteMessage()
  ctx.wizard.next()
  await ctx.wizard.steps[ctx.wizard.cursor](ctx)
  await ctx.answerCbQuery()
})

weekScoresWizard.action('confirm_details', async (ctx) => {

  let message  = 'Here is your point summary:\n\n'
  message += `Exercise Sessions: ${ctx.wizard.state.pointsData.exercise}\n`
  message += `Tried a New Sport: ${ctx.wizard.state.pointsData.trySport ? 'Yes' : 'No'}\n`
  message += `Attended Sports Turn: ${ctx.wizard.state.pointsData.sportsTurn ? 'Yes' : 'No'}\n`
  message += `Tried a New Recipe: ${ctx.wizard.state.pointsData.tryRecipe ? 'Yes' : 'No'}\n`
  message += `Had Good Sleep: ${ctx.wizard.state.pointsData.goodSleep ? 'Yes' : 'No'}\n`
  message += `Meditated: ${ctx.wizard.state.pointsData.meditate ? 'Yes' : 'No'}\n`
  message += `Limited Alcohol: ${ctx.wizard.state.pointsData.lessAlc ? 'Yes' : 'No'}\n`
  message += `Total Points: ${ctx.wizard.state.pointsData.total}\n\n`

  try {
    await pointService.addPoints(ctx.from.id, ctx.wizard.state.pointsData)
    await ctx.editMessageText(message)
    await ctx.reply('Your points have been successfully recorded')
    await ctx.answerCbQuery()
    return ctx.scene.leave()
  } catch (error) {
    await ctx.editMessageText(texts.actions.error.error)
    await ctx.answerCbQuery()
    return ctx.scene.leave()
  }
})

weekScoresWizard.action('start_over', async (ctx) => {
  await ctx.editMessageText('starting over!')
  ctx.wizard.selectStep(0)
  await ctx.answerCbQuery()
  return ctx.wizard.steps[0](ctx)
})

module.exports = { weekScoresWizard }
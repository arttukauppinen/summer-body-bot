const { Scenes } = require('telegraf')
const texts = require('../../utils/texts')
const { updateGoodSleepPoints, updateTeamGoodSleepPoints } = require('../../services/point-service')
const termsScene = new Scenes.BaseScene('terms_scene')
termsScene.enter(async (ctx) => {
    await updateGoodSleepPoints()
    await updateTeamGoodSleepPoints()
    let formattedTerms = texts.terms.only_terms.replace(/[-_.!()]/g, '\\$&')
    await ctx.replyWithMarkdownV2(`*Terms and Conditions*\n\n${formattedTerms}`)
    await ctx.scene.leave()
})

module.exports = { termsScene }

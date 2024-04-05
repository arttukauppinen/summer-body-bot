const { Scenes } = require('telegraf')
const texts = require('../../utils/texts')
const termsScene = new Scenes.BaseScene('terms_scene')
termsScene.enter(async (ctx) => {
    let formattedTerms = texts.terms.only_terms.replace(/[-_.!()]/g, '\\$&')
    await ctx.replyWithMarkdownV2(`*Terms and Conditions*\n\n${formattedTerms}`)
    await ctx.scene.leave()
})

module.exports = { termsScene }

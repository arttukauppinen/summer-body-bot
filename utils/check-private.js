const onlyPrivate = (ctx, next) => {
    if (ctx.update && ctx.update.message && ctx.update.message.chat.type === 'private') {
    return next()
    }
    ctx.reply('This command can only be used in private messages. Use command /help to see available commands.')
}
  
module.exports = onlyPrivate
  
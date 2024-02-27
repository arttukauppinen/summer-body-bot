const TelegramBot = require('node-telegram-bot-api')
const { telegramToken } = require('./config')
const { User } = require('./database')

const bot = new TelegramBot(telegramToken, { polling: true })

bot.on('message', async (msg) => {
  const chatId = msg.chat.id

  // Example: Save user to database
  if (msg.text.toLowerCase() === '/start') {
    const user = new User({ username: msg.from.username, chatId: chatId })
    await user.save()
    bot.sendMessage(chatId, 'You have been added to the database.')
  }
})

module.exports = bot
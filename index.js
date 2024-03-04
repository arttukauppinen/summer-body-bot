const { Telegraf } = require('telegraf')
const bot = require('./bot')

require('./config')

bot.launch().then(() => {
  console.log('Bot started')
}).catch(err => {
  console.error('Could not start the bot', err)
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// const { Telegraf } = require('telegraf')
// const mongoose = require('mongoose')
// const config = require('./config')
// const bot = require('./bot')

// mongoose.connect(config.mongoUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Connected to MongoDB')
//   // Start the bot
//   bot.launch()
//   console.log('Bot started')
// }).catch(err => {
//   console.error('Could not connect to MongoDB', err)
// })

// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))

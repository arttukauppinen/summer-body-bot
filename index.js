const { connectDatabase, disconnectDatabase } = require('./database')
const bot = require('./bot')

async function startBot() {
  await connectDatabase()

  try {
    await bot.launch()
    console.log('Bot started')
  } catch (err) {
    console.error('Could not start the bot', err)
  }
}

startBot()

process.once('SIGINT', () => {
  bot.stop('SIGINT')
    .then(disconnectDatabase)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error during shutdown:', error)
      process.exit(1)
    })
})

process.once('SIGTERM', () => {
  bot.stop('SIGTERM')
    .then(disconnectDatabase)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error during shutdown:', error)
      process.exit(1)
    })
})

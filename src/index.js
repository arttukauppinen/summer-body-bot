const { connectDatabase } = require('./database')
const bot = require('./bot')

const start = async () => {
  await connectDatabase();
  console.log('Bot has been started...')
};

start()
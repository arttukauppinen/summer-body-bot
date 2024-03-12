const schedule = require('node-schedule')
const bot = require('../bot')
const { sendReminder } = require('../services/user-service')
const config = require('../config')

//doesnt work
const scheduleReminders = () => {
  console.log('Scheduled reminder time:', config.reminderTime, 'Timezone:', config.reminderTimezone)

  try {
    schedule.scheduleJob(config.reminderTime, { tz: config.timezone }, function() {
      console.log('Reminder is being executed.')
      console.log(bot)
      console.log(bot.telegram)
      const currentDate = new Date().toISOString().split('T')[0]
      if (config.allowedDates.includes(currentDate)) {
        sendReminder(bot)
      }
    })
  } catch (error) {
    console.error('Scheduling error:', error)
  }
}

module.exports = scheduleReminders
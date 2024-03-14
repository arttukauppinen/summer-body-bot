const schedule = require('node-schedule')
const bot = require('../bot')
const { sendReminder } = require('../services/user-service')
const config = require('../config')

const scheduleReminders = () => {
  try {
    const timeZoneAdj = -2
    const timeParts = config.reminderTime.split(':')
    const hour = parseInt(timeParts[0], 10) + timeZoneAdj
    const minute = parseInt(timeParts[1], 10)

    config.allowedDates.forEach((date) => {
      const dateParts = date.split('-')
      const month = parseInt(dateParts[1], 10)
      const day = parseInt(dateParts[2], 10)
      console.log(hour, minute, month, day)
      const cronString = `${minute} ${hour} ${day} ${month} *`
      schedule.scheduleJob(cronString, function() {
        console.log('Reminder is being executed.')
        console.log(bot)
        console.log(bot.telegram)
        sendReminder(bot)
      })
    })

  } catch (error) {
    console.error('Scheduling error:', error)
  }
}

module.exports = scheduleReminders
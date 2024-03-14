const schedule = require('node-schedule')
const bot = require('../bot')
const { sendReminder } = require('../services/user-service')
const config = require('../config')

//couldnt get this working with other than straight cron format
const scheduleReminders = () => {
  try {
    const timeZoneAdj = - 2
    const timeParts = config.reminderTime.split(':')
    const hour = parseInt(timeParts[0], 10) + timeZoneAdj
    const minute = parseInt(timeParts[1], 10)

    config.allowedDates.forEach((date) => {
      const dateParts = date.split('-')
      const month = parseInt(dateParts[1], 10)
      const day = parseInt(dateParts[2], 10)

      const cronString = `${minute} ${hour} ${day} ${month} *`
      schedule.scheduleJob(cronString, function() {
        console.log("Reminder is being executed with (min hour day month): ", minute, hour + 2, day, month)
        sendReminder(bot)
      })
    })

  } catch (error) {
    console.error('Scheduling error:', error)
  }
}

module.exports = scheduleReminders
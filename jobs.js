const schedule = require('node-schedule')
const userController = require('./commands/userController')

//TODO this is unfinished code but remember to move the schedule setting into env file
const scheduleReminders = () => {
  // Schedule to send a reminder every Sunday at 8 pm
  schedule.scheduleJob({ hour: 20, minute: 0, dayOfWeek: 7 }, () => {
    userController.sendWeeklyReminder()
  })
}

module.exports = {
  scheduleReminders
}

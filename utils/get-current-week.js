const { startDate, endDate } = require('../config')

const getCurrentWeek = () => {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (now < start || now > end) {
    return null // Not within the competition period
  }

  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weekNumber = Math.floor((now - start) / msPerWeek) + 1

  return weekNumber
}

module.exports = getCurrentWeek
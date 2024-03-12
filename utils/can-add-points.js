const { allowedDates } = require('../config')

const canAddPoints = async (lastSubmission) => {
  const todayStr = new Date().toISOString().slice(0, 10)
  const lastSubmissionStr = lastSubmission ? new Date(lastSubmission).toISOString().slice(0, 10) : null
    
  if (!allowedDates.includes(todayStr)) {
    return {
      canAdd: false,
      reason: 'Today is not an allowed date to add week scores. Please check back later.'
    }
  }

  if (lastSubmissionStr === todayStr) {
    return {
      canAdd: false,
      reason: 'You have already submitted your points for this week. If you think this is a mistake, contact @arttukaup'
    }
  }

  return { canAdd: true }
}

module.exports = canAddPoints

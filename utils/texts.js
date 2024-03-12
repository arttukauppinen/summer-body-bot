const startDate = 'your_start_date_here'
const endDate = 'your_end_date_here'
//TODO: this is a copy paste so change accordingly if needed
//TODO: logic for start/end dates
//TODO: maybe all texts could be here

const texts = {
  actions: {
    feedback: {
      start: "Please share your feedback — positive, negative, or suggestions for improvement. Your feedback is anonymous. To cancel, type 'cancel'.",
      finish: "Thank you for from your feedback!",
      end: "Give feedback next time!"
    },
    start: {
      introduction: `Hello and welcome to the competition!👋🏻😄 This friendly competition organized by TiK and PT to promote a healthier lifestyle for the members of both guilds. The objective is to gather points for your group of four and for your guild. You earn points by excercising and with healthy habits. Scores for the past week can be added on Sundays, Mondays, Tuesdays and Wednesdays starting on ${startDate}. Points are always given for the past week!!! The competition ends on ${endDate}.`,
      instructions: "Start off by registering into the bot with using command /register. If you are not in a team yet, first form a team of four from TiK or PT. You have one week time from initial registration to change your information if needed. Use command /help to show all available commands and what they do. Most commands are not usable before you finish registeration."
    },
    error: {
      error: "Oops! Something went wrong while processing your request. Please try again. We've logged the error for further review, but if the issue persists or you need immediate help, contact @arttukaup on Telegram."
    }
  },
  terms: {
    question: 'Using Kesakuntoonbot you are accepting following terms and conditions. The main purpose of this bot is to gather scores of attendees of the competition between TiK and PT and also between teams. Bots functionality can change anytime and Kesakuntoon can be shut down anytime. Kesakuntoon bot admins and developers are not responsible of possible harms that could happen when attending into competition and using this bot could happen. Kesakuntoon is completely free to use and attending into competition is free for members of TiK and Pt guilds. To keep track of attendees scores Kesakuntoon bot gathers information about users. Gathered information is never sold or given to any third-party member. Saved information can be deleted when requested. Any offensive team name or acting in competition is not permitted. Those teams will be deleted, and user banned from using the bot. Gathered information is deleted after the competition has finished. Newest terms and conditions can be read with command /terms. This terms and conditions can change anytime without separate announcement.',
    only_terms: 'Using Kesakuntoonbot you are accepting following terms and conditions. The main purpose of this bot is to gather scores of attendees of the competition between TiK and Pt and also between teams. Bots functionality can change anytime and Kesakuntoon can be shut down anytime. Kesakuntoon bot admins and developers are not responsible of possible harms that could happen when attending into competition and using this bot could happen. Kesakuntoon is completely free to use and attending into competition is free for members of TiK and Pt guilds. To keep track of attendees scores Kesakuntoon bot gathers information about users. Gathered information is never sold or given to any third-party member. Saved information can be deleted when requested. Any offensive team name or acting in competition is not permitted. Those teams will be deleted, and user banned from using the bot. Gathered information is deleted after the competition has finished. Newest terms and conditions can be read with command /terms. This terms and conditions can change anytime without separate announcement.'
  }
}

module.exports = texts
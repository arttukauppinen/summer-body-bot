const schedule = require('node-schedule');

console.log('Scheduler test script started.');

const date = new Date(Date.now() + 5000); // Schedule to run 5 seconds from now
schedule.scheduleJob(date, () => {
  console.log('The scheduler test job has been executed.');
});

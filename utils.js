let User = require('./user.model');
let Session = require('./session.model');
let Message = require('./message.model');

const purgeSessions = () => {
    // TODO: Write a function to purge all old session IDs automatically, use cron to schedule
}

const loadDefaultTemplates = () => {
    // TODO: Write a function that loads default mailing templates into the database
}

const sendMail = (user, message) => {
    // TODO: Write a function that can take in a message and a user and send the email using nodemailer
}


module.exports.purgeSessions = purgeSessions;
module.exports.loadDefaultTemplates = loadDefaultTemplates;
module.exports.sendMail = sendMail;
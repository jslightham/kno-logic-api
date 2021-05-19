const fs = require('fs');
const nodemailer = require("nodemailer");
var config = require('./config');
let User = require('./user.model');
let Session = require('./session.model');
let Message = require('./message.model');
var maxSessionLength = config.maxSessionLength;

// purgeSessions() purge sessions that have existed for longer than maxSessionLength
const purgeSessions = () => {
    console.log("Purging old sessions...");
    Session.find({}, (err, arr) => {
        for (let i = 0; i < arr.length; i++) {
            let timeDifference = new Date().getTime() - arr[i].date;
            let dayDifference = timeDifference / (1000 * 3600 * 24);
            if (dayDifference > maxSessionLength) {
                arr[i].delete().catch(e => {
                    console.log(e);
                });
            }
        }
    });
}

// loadDefaultTemplates() load the default email templates into the database
// if no template exists for that name
const loadDefaultTemplates = () => {
    console.log("Loading default email templates...")
    fs.readdir('./templates', (err, files) => {
        files.forEach(file => {
            fs.readFile('./templates/' + file, 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                }
                let name = file.substring(0, file.indexOf('.'));
                Message.findOne({ name: name }, (err, msg) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (msg) {

                    } else {
                        let newMsg = Message();
                        newMsg.name = name;
                        newMsg.subject = data.substring(0, data.indexOf("\n"));
                        newMsg.body = data.substring(data.indexOf("\n") + 1);
                        newMsg.save()
                            .then(() => {
                                console.log("Loaded " + name + " message");
                            })
                            .catch(() => {
                                console.log("Error loading messages from file.");
                            });
                    }
                });
            });
        });
    });
}

// sendMail(user, message, replacements) send an email with message to the user, making
// replacements in the message
// replacements is an array of data {from, to}
const sendMail = async (user, message, replacements) => {
    console.log("Sending mail...");

    let transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.secure,
        auth: {
            user: config.mail.user,
            pass: config.mail.pass,
        },
    });
    Message.findOne({ name: message }, (err, message) => {
        let msgBody = message.body;

        for (let i = 0; i < replacements.length; i++) {
            msgBody = msgBody.replace(replacements[i].from, replacements[i].to);
        }

        console.log(message);

        try {
            transporter.sendMail({
                from: config.mail.from,
                to: user.email,
                subject: message.subject,
                text: msgBody,
            });

        } catch (error) {
            console.log("Error sending mail: ")
            console.error(error);
        }
    })
}


// checkSession(userId, sessionId) checks if the sessionId is valid for the user
const checkSession = (userId, sessionId, f) => {
    Session.find({ userId: userId, sessionId: sessionId }, (err, res) => {
        if (res) {
            f(true);
            return;
        }
        f(false);
    });
}

// isAdmin(userId) checks if the user with userId is an administrator
const isAdmin = (userId, f) => {
    User.findById(userId, (err, res) => {
        if (res.permission == 1) {
            f(true);
            return;
        }
        f(false);
    })
}

// dateToEpoch(date) change the time of the date object to epoch
function dateToEpoch(d) {
    console.log(d);
    if (d) {
        // When comparing js dates, the timezone does not matter
        // ex. May 17 EDT == May 17 GMT, May 17 EDT != May 18 GMT
        return d.setHours(0, 0, 0, 0);
    } else {
        return null;
    }
}

// removeValue(array, item) remove item from the array
function removeValue(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

module.exports.purgeSessions = purgeSessions;
module.exports.loadDefaultTemplates = loadDefaultTemplates;
module.exports.sendMail = sendMail;
module.exports.checkSession = checkSession;
module.exports.isAdmin = isAdmin;
module.exports.dateToEpoch = dateToEpoch;
module.exports.removeValue = removeValue;

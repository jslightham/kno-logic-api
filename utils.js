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
                        newMsg.subject = "Email From Kno-Logic" //TODO: Should load these from config.js
                        newMsg.body = data;
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

    let msgBody = message.body;

    for (let i = 0; i < replacements.length; i++) {
        msgBody = msgBody.replace(replacements[i].from, replacements[i].to);
    }

    try {
        await transporter.sendMail({
            from: config.mail.from, 
            to: user.email, 
            subject: message.subject, 
            text: msgBody, 
          });
        
    } catch (error) {
        console.log("Error sending mail: ")
        console.error(error);
    }
}

module.exports.purgeSessions = purgeSessions;
module.exports.loadDefaultTemplates = loadDefaultTemplates;
module.exports.sendMail = sendMail;

const fs = require('fs');
const nodemailer = require("nodemailer");
const config = require('../config');
let Message = require('../schema/message.model');

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

module.exports.loadDefaultTemplates = loadDefaultTemplates;
module.exports.sendMail = sendMail;
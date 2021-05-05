var config = {};

// Mailer settings
config.mail = {};
config.mail.host = "localhost";
config.mail.port = "465";
config.mail.secure = false;
config.mail.user = "username";
config.mail.pass = "pass";
config.mail.from = "<noreply@knologic.com>"

// Session purge settings
config.maxSessionLength = 30;


module.exports = config;

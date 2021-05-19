var config = {};

// Mailer settings
config.mail = {};
config.mail.host = "localhost";
config.mail.port = "587";
config.mail.secure = false;
config.mail.user = "email";
config.mail.pass = "password";
config.mail.from = "name"

// Session purge settings
config.maxSessionLength = 30;


module.exports = config;

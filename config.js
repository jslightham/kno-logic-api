var config = {};
/*
 * Mailer settings
*/
config.mail = {};
// Mail host
config.mail.host = "localhost";
// Mail port
config.mail.port = "587";
// Mail use secure
config.mail.secure = false;
// Mail username
config.mail.user = "email";
// Mail password
config.mail.pass = "password";
// Mail from name
config.mail.from = "name";

/*
 * Session settings
*/
// Maximum session length in days
config.maxSessionLength = 1;
config.maxRefreshLength = 360;

// Session string character length
config.sessionCharacterLength = 25;
config.refreshChracterLength = 60;

/*
 * SSL settings
*/
config.ssl = {};
// Run SSL server
config.ssl.use = false;
// Location of SSL key
config.ssl.key = "/etc/letsencrypt/live/knologic.chickenkiller.com/privkey.pem";
// Location of SSL cert
config.ssl.cert = "/etc/letsencrypt/live/knologic.chickenkiller.com/fullchain.pem";
// SSL port
config.ssl.port = 4000;

/*
 * HTTP settings
*/
config.http = {};
// HTTP port
config.http.port = 8080;

/*
 * Database Settings
*/
config.db = {}
config.db.connection = 'mongodb://localhost:27017/kno-logic';

module.exports = config;

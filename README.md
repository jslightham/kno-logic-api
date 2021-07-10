
# kno-logic-api
<p align="center">
  <img src="https://imgur.com/P2nDq7b.png" width="180">
</p>

Kno-logic is a mobile learning platform with a short number of curated articles added daily for lifelong learners. This API was built with NodeJS and Express, and uses MongoDB as a database.

## Running Application
If you would like to run the application you will need:
 - NodeJS 14
 - MongoDB Community Server

Install the latest version of [`Node.js`](https://nodejs.org/en/). 

Install the latest version of [`MongoDB Community Server`](https://www.mongodb.com/try/download/community). 

Clone the repository, and run the following:
```bash
# start database
mongod

# install dependencies
npm install

# server with hot reload (optional, requires nodemon)
nodemon

# running the server
node .
```
## Email Templates
Emails are stored in the [`templates`](https://github.com/jslightham/kno-logic-api/tree/main/templates) directory. Any text files in the [`templates`](https://github.com/jslightham/kno-logic-api/tree/main/templates) directory will be added to the MongoDB message collection. The first line of the file is the subject of the email, and will be remoevd from the message body.

Any portion of the message can be replaced when sending the email. The convention used in all default email templates  is `%replace_string%`. The replace string does not matter since when calling the sendMail function, replacements is an array of data with the form `{from: "%replace_string%", to: "Username"}`. 

Email subjects are the first line of the file, which are removed from the email body.

## Configuration
Configuration for the application is done in the [`config.js`](https://github.com/jslightham/kno-logic-api/blob/main/config.js) file. 

Example configuration:
```
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
```

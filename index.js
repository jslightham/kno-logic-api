require('log-timestamp');
const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const utils = require ('./utils/utils');
const CronJob = require('cron').CronJob;
const config = require('./config.js');
const adminRoutes = require('./routes/admin.route');
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
const categoryRoutes = require('./routes/category.route');
const mongoSanitize = require('express-mongo-sanitize');
const fs = require("fs");
const { Http2ServerRequest } = require('http2');

console.log("Starting Kno-Logic Backend Server");

// Handle MongoDB connection
mongoose.Promise = global.Promise;
mongoose.connect(config.db.connection, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        console.log('Connected to dabase');
        utils.mail.loadDefaultTemplates();
        utils.cron.purgeSessions();
    },
    err => {
        console.error('Could not connect to database: ');
        console.error(err);
    }
);

// Express server
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Sanitize data to prevent NoSQL injections
app.use(mongoSanitize());

// Express routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/category', categoryRoutes);

app.listen(config.http.port, () => {
    console.log('Express server running on port:', PORT);
});

if (config.ssl.use) {
    const options = {
        key: fs.readFileSync(config.ssl.key),
        cert: fs.readFileSync(config.ssl.cert)
    }
    https.createServer(options, app).listen(config.ssl.port);
}


// Cron jobs
var purge = new CronJob('*/5 * * * *', utils.cron.purgeSessions);
purge.start();
